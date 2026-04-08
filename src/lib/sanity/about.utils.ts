/**
 * Pure utility functions for About section Sanity data mapping.
 *
 * These are server-safe, side-effect-free transformations of `AboutPost`
 * CMS data into the view-model contracts consumed by `AboutSection.astro`.
 *
 * Story 9: replaces singleton `primaryImage` with ordered `galleryItems[]`.
 * Priority: valid galleryImages → legacy mainImage → synthetic placeholders.
 *
 * Story 9 / data-shape fix: `buildAboutSanityStateFromPosts` aggregates the
 * `mainImage` from ALL `AboutPost` documents returned by the multi-doc query.
 * This fixes the issue where ABOUT_QUERY used `[0]` and silently dropped all
 * images from subsequent documents.
 */

import type {
  AboutPost,
  AboutPostMainImage,
  AboutGalleryItem,
  AboutSectionSanityState,
  RawGalleryImage,
  SanityImageSource,
} from './types';

/** Minimum visible slots — pads with placeholders when real images are fewer. */
const MIN_GALLERY_SLOTS = 4;

/**
 * Returns true when a raw gallery image has a usable CDN URL.
 * Items without a resolvable URL are filtered out to avoid broken `<img>` tags.
 */
function hasUsableUrl(img: RawGalleryImage): img is RawGalleryImage & { url: string } {
  return typeof img.url === 'string' && img.url.length > 0;
}

/**
 * Extracts the canonical asset reference id from a raw gallery image's asset field.
 *
 * Sanity GROQ can return the asset field in two shapes:
 *   - Reference shape:     `{ _type: 'reference', _ref: 'image-...' }` — used when the
 *     query does NOT dereference the asset (no `asset->` operator).
 *   - Dereferenced shape:  `{ _id: 'image-...', _type: 'sanity.imageAsset', ... }` — returned
 *     when the query uses `asset->{ ... }`, replacing the reference with the asset document.
 *
 * `@sanity/image-url` requires a canonical reference `{ _type: 'reference', _ref: 'image-...' }`
 * to build CDN URLs. Passing a dereferenced asset causes:
 *   "Malformed asset _ref ''. Expected an id like 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'"
 *
 * This helper resolves the ref regardless of which shape the query returns.
 */
function resolveAssetRef(asset: SanityImageSource | Record<string, unknown> | undefined): string | undefined {
  if (!asset || typeof asset !== 'object') return undefined;
  const a = asset as Record<string, unknown>;
  // Reference shape: has _ref directly
  if (typeof a['_ref'] === 'string' && a['_ref'].length > 0) return a['_ref'];
  // Dereferenced shape: asset document has _id (which equals the original _ref)
  if (typeof a['_id'] === 'string' && a['_id'].length > 0) return a['_id'];
  return undefined;
}

/**
 * Builds a canonical Sanity image source for `urlFor()` from a raw gallery image.
 *
 * `@sanity/image-url` requires `{ _type: 'image', asset: { _type: 'reference', _ref: '...' } }`.
 * This function reconstructs that canonical shape even when the GROQ query dereferenced the asset
 * (producing an asset document with `_id` instead of a reference with `_ref`).
 */
function buildImageSource(img: RawGalleryImage): SanityImageSource | undefined {
  const ref = resolveAssetRef(img.asset);
  if (!ref) return undefined;
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: ref,
    },
  } as unknown as SanityImageSource;
}

/**
 * Converts a raw gallery image to an `AboutGalleryItem` of kind `image`.
 * `variant` is provided externally (index % 4) so this function stays pure.
 *
 * The `source` field is built as a canonical Sanity image reference so that
 * `urlFor(source)` works regardless of whether the GROQ query returned the asset
 * as a reference or as a dereferenced asset document.
 */
function toImageItem(
  img: RawGalleryImage & { url: string },
  variant: 0 | 1 | 2 | 3
): AboutGalleryItem | null {
  const source = buildImageSource(img);
  if (!source) return null;  // Cannot build a valid source → skip
  return {
    kind: 'image',
    key: img._key,
    variant,
    source,
    url: img.url,
    alt: img.alt ?? '',
    lqip: img.lqip,
  };
}

/**
 * Computes the repeating visual variant for an item at position `index`.
 * The four-slot cadence (primary/secondary/tertiary/quaternary) repeats for
 * galleries larger than 4 images — approved override for Story 9.
 */
function variantAt(index: number): 0 | 1 | 2 | 3 {
  return (index % 4) as 0 | 1 | 2 | 3;
}

/**
 * Pads a list of gallery items with placeholder items until at least
 * `MIN_GALLERY_SLOTS` slots exist. Returns the padded array.
 *
 * Shared by `buildAboutSanityState` and `buildAboutSanityStateFromPosts`.
 */
function padWithPlaceholders(imageItems: AboutGalleryItem[]): AboutGalleryItem[] {
  const totalSoFar = imageItems.length;
  if (totalSoFar >= MIN_GALLERY_SLOTS) return imageItems;

  const placeholders: AboutGalleryItem[] = [];
  for (let i = totalSoFar; i < MIN_GALLERY_SLOTS; i++) {
    placeholders.push({
      kind: 'placeholder',
      key: `placeholder-${i}`,
      variant: variantAt(i),
    });
  }
  return [...imageItems, ...placeholders];
}

/**
 * Maps an `AboutPost` CMS document (or null/undefined) to the
 * `AboutSectionSanityState` view-model consumed by `AboutSection.astro`.
 *
 * Algorithm:
 * 1. Guard: missing document → `{ galleryItems: [] }`
 * 2. Collect valid images: filter `galleryImages` by usable URL
 * 3. If no valid gallery images, fall back to `mainImage` as sole image item
 * 4. Assign `variant = index % 4` to each surviving image item
 * 5. Pad with placeholder items until at least `MIN_GALLERY_SLOTS` slots exist
 *
 * The gallery is NOT capped — all valid images are included (Story 9 override).
 *
 * @param aboutPost - Raw Sanity document or null/undefined
 * @returns `AboutSectionSanityState` with `galleryItems` always defined
 */
export function buildAboutSanityState(
  aboutPost: AboutPost | null | undefined
): AboutSectionSanityState {
  // Guard: no document at all
  if (!aboutPost) return { galleryItems: [] };

  const { galleryImages, mainImage, mainImageAlt } = aboutPost;

  // Step 1: filter valid gallery images
  const validGallery = (galleryImages ?? []).filter(hasUsableUrl);

  // Step 2: build image items from valid gallery, or fall back to mainImage
  let imageItems: AboutGalleryItem[];

  if (validGallery.length > 0) {
    imageItems = validGallery
      .map((img, i) => toImageItem(img, variantAt(i)))
      .filter((item): item is AboutGalleryItem => item !== null);
  } else if (mainImage?.asset) {
    // Legacy fallback: single image from mainImage.
    // `mainImage` is now typed as `AboutPostMainImage` which has the projected fields.
    // `alt` comes from `mainImage.alt` (where the dataset stores it) with fallback
    // to `mainImageAlt` (the legacy top-level field, often null in production).
    const fallbackRaw: RawGalleryImage & { url: string } = {
      _key: 'legacy-main',
      _type: 'image',
      alt: mainImage.alt ?? mainImageAlt ?? '',
      url: mainImage.url ?? '',
      lqip: mainImage.lqip,
      asset: mainImage.asset,
    };
    // Only use fallback if the asset has a usable url
    if (hasUsableUrl(fallbackRaw)) {
      const item = toImageItem(fallbackRaw, 0);
      imageItems = item ? [item] : [];
    } else {
      imageItems = [];
    }
  } else {
    imageItems = [];
  }

  // Step 3: pad with placeholders if fewer than MIN_GALLERY_SLOTS items
  return {
    galleryItems: padWithPlaceholders(imageItems),
  };
}

/**
 * Converts a single `AboutPostMainImage` to a gallery-ready `RawGalleryImage`
 * with a fallback key derived from the document id.
 *
 * Extracts `alt` from `mainImage.alt` (where the Sanity dataset stores it),
 * `url` from the aliased `mainImage.url` field, and passes the `asset` reference
 * through unchanged so `buildImageSource` can reconstruct the canonical urlFor shape.
 */
function mainImageToRawGalleryImage(
  mainImage: AboutPostMainImage,
  docId: string
): RawGalleryImage {
  return {
    _key: `main-${docId}`,
    _type: 'image',
    alt: mainImage.alt ?? '',
    url: mainImage.url,
    lqip: mainImage.lqip,
    asset: mainImage.asset,
  };
}

/**
 * Maps an array of `AboutPost` documents — as returned by the multi-doc
 * `ABOUT_QUERY` (which no longer uses `[0]`) — into the `AboutSectionSanityState`
 * view-model consumed by `AboutSection.astro`.
 *
 * Algorithm:
 * 1. Guard: empty array → `{ galleryItems: [] }`
 * 2. For each document: if it has a valid `mainImage` with resolvable asset ref,
 *    convert it to a gallery image item
 * 3. Assign `variant = index % 4` cyclically across all collected items
 * 4. Pad with placeholder items until at least `MIN_GALLERY_SLOTS` slots exist
 *
 * This is the primary entry point for Story 9 rendering when the CMS data uses
 * the multi-document pattern (each document contributes one mainImage to the gallery).
 *
 * @param posts - Array of raw `AboutPost` documents from Sanity (may be empty)
 * @returns `AboutSectionSanityState` with `galleryItems` always defined
 */
export function buildAboutSanityStateFromPosts(
  posts: AboutPost[]
): AboutSectionSanityState {
  // Guard: no documents
  if (!posts || posts.length === 0) return { galleryItems: [] };

  // Collect image items from each document's mainImage
  const rawItems: (RawGalleryImage & { url: string })[] = [];

  for (const post of posts) {
    if (!post.mainImage?.asset) continue;

    const raw = mainImageToRawGalleryImage(post.mainImage, post._id);
    if (hasUsableUrl(raw)) {
      rawItems.push(raw as RawGalleryImage & { url: string });
    }
  }

  // Convert to gallery items with cyclic variant assignment
  const imageItems: AboutGalleryItem[] = rawItems
    .map((raw, i) => toImageItem(raw, variantAt(i)))
    .filter((item): item is AboutGalleryItem => item !== null);

  // Pad with placeholders if fewer than MIN_GALLERY_SLOTS items
  return {
    galleryItems: padWithPlaceholders(imageItems),
  };
}
