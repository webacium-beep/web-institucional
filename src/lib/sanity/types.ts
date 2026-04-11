/**
 * Shared Sanity content type contracts.
 *
 * Story 4 introduced the original singleton About image contract.
 * Story 9 replaces the singleton with a multi-image gallery contract
 * while preserving the legacy `mainImage` field for backward compatibility.
 */

import type { SanityImageSource } from '@sanity/image-url';

/**
 * Re-export the canonical Sanity image reference type so consumers only
 * need to import from this module.
 */
export type { SanityImageSource };

/**
 * Projected shape of a mainImage field from ABOUT_QUERY.
 *
 * Story 9 / data-shape fix: alt text is stored inside the mainImage object
 * in the Sanity dataset (`mainImage.alt`), not in the top-level `mainImageAlt`
 * field (which is null in the production dataset).
 *
 * The `asset` field is the canonical Sanity reference `{ _type, _ref }` —
 * NOT dereferenced — so `urlFor(mainImage)` works correctly.
 * `url` and `lqip` are aliased from the asset for convenience.
 */
export interface AboutPostMainImage {
  /** Alt text stored inside the image object in Sanity. */
  alt?: string;
  /** Canonical Sanity reference — required by urlFor(). NOT dereferenced. */
  asset?: SanityImageSource | Record<string, unknown>;
  /** CDN URL aliased in GROQ as `"url": asset->url`. */
  url?: string;
  /** LQIP base64 aliased in GROQ as `"lqip": asset->metadata.lqip`. */
  lqip?: string;
}

/**
 * Minimal representation of the `aboutPost` document type.
 * Story 9: extended with `galleryImages` array alongside legacy `mainImage`.
 * Story 9 / data-shape fix: `mainImage` is now typed as `AboutPostMainImage`
 * to expose the `alt`, `url`, and `lqip` aliases alongside the canonical asset reference.
 */
export interface AboutPost {
  _id: string;
  _type: 'aboutPost';
  /**
   * Main image with alt text and asset reference.
   * Story 9 fix: typed as `AboutPostMainImage` to capture the projected shape.
   * Used as a gallery item when `galleryImages` is absent or empty.
   */
  mainImage?: AboutPostMainImage;
  /**
   * Alt text from CMS for the legacy main image (may be null in the dataset).
   * Prefer `mainImage.alt` — alt is stored inside the image object.
   */
  mainImageAlt?: string;
  /**
   * Gallery image collection (Story 9).
   * When populated, takes priority over `mainImage` for rendering.
   */
  galleryImages?: RawGalleryImage[];
}

/**
 * Raw shape of each gallery image as projected by ABOUT_QUERY.
 * Internal only — consumers receive `AboutGalleryItem[]` after normalization.
 *
 * The `asset` field may arrive in two shapes depending on the GROQ projection:
 *   - Reference shape: `{ _type: 'reference', _ref: 'image-...' }` — when no `asset->` dereference
 *   - Dereferenced shape: `{ _id: 'image-...', _type: 'sanity.imageAsset', url: '...', ... }` — when
 *     the query uses `asset->{ ... }`, replacing the reference with the full asset document.
 *
 * The mapper in `about.utils.ts` handles both shapes via `resolveAssetRef()`.
 */
export interface RawGalleryImage {
  _key: string;
  _type?: 'image';
  alt?: string;
  /** CDN URL aliased in GROQ as `"url": asset->url`. */
  url?: string;
  /** LQIP base64 aliased in GROQ as `"lqip": asset->metadata.lqip`. */
  lqip?: string;
  /**
   * Asset field — may be a Sanity reference `{ _type, _ref }` or a dereferenced
   * asset document `{ _id, _type: 'sanity.imageAsset', url, ... }`.
   * Use `resolveAssetRef()` to extract the canonical `_ref` for `urlFor()`.
   */
  asset?: SanityImageSource | Record<string, unknown>;
}

/**
 * UI-facing contract for a single renderable gallery image.
 * Produced from the CMS payload after normalization in `buildAboutSanityState`.
 *
 * `variant` cycles through 0–3 (primary/secondary/tertiary/quaternary) based
 * on the item's position index, enabling consistent visual rhythm for any
 * gallery size.
 */
export interface AboutGalleryImage {
  /** Unique item key — sourced from Sanity `_key`. */
  key: string;
  /** Repeating visual slot: 0=primary, 1=secondary, 2=tertiary, 3=quaternary. */
  variant: 0 | 1 | 2 | 3;
  /** Sanity image source — passed to `urlFor()` for CDN URL building. */
  source: SanityImageSource;
  /** Resolved CDN URL for use as `<img src>`. */
  url: string;
  /** Alt text; empty string for decorative images when CMS field is absent. */
  alt: string;
  /** Base64 LQIP string for progressive loading; undefined if not projected. */
  lqip?: string;
}

/**
 * Discriminated union for gallery slots.
 * `image` items have all renderable fields; `placeholder` items keep only
 * the structural fields needed for layout rendering.
 */
export type AboutGalleryItem =
  | ({ kind: 'image' } & AboutGalleryImage)
  | { kind: 'placeholder'; key: string; variant: 0 | 1 | 2 | 3 };

/**
 * View-model contract passed to the `AboutSection` render layer.
 * `galleryItems` is always present (may be empty); `AboutSection.astro`
 * maps over it directly.
 *
 * Story 4 `primaryImage` is removed — consumers must migrate to `galleryItems`.
 */
export interface AboutSectionSanityState {
  galleryItems: AboutGalleryItem[];
}

/**
 * Raw Lanzamientos document shape.
 *
 * The CMS may provide either a singleton `mainImage` or an `images[]` collection.
 * The Lanzamientos section renders only ONE image: `images[0]` when present,
 * otherwise it falls back to `mainImage`.
 */
export interface LanzamientosPost {
  _id: string;
  _type: 'lanzamientosPost';
  mainImage?: AboutPostMainImage;
  images?: Array<RawGalleryImage | undefined>;
}

export interface LanzamientosSectionImage {
  url: string;
  alt: string;
  source: SanityImageSource;
  lqip?: string;
}

export interface LanzamientosSectionSanityState {
  hasImage: boolean;
  image?: LanzamientosSectionImage;
}
