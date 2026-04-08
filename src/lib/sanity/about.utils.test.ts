/**
 * Tests for the About section Sanity data-mapping utility.
 *
 * Strategy: `buildAboutSanityState` and `buildAboutSanityStateFromPosts` are pure
 * functions that transform `AboutPost | null` or `AboutPost[]` results into the
 * `AboutSectionSanityState` view-model. No mocks needed — deterministic and side-effect free.
 *
 * Story 4 original tests drive the legacy `primaryImage` path (now removed).
 * Story 9 adds gallery normalization: galleryImages[], fallback, variant cycling,
 * placeholder synthesis, and invalid-asset filtering.
 * Story 9 / Bug-fix: `buildAboutSanityStateFromPosts` aggregates mainImage from
 * ALL aboutPost documents so all intended images render.
 */

import { describe, it, expect } from 'vitest';
import { buildAboutSanityState, buildAboutSanityStateFromPosts } from './about.utils';
import { createUrlFor } from './image';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeImageSource = (ref: string) => ({
  _type: 'image' as const,
  asset: {
    _type: 'reference' as const,
    _ref: ref,
  },
});

// FIXTURE_MAIN_IMAGE mirrors the GROQ-projected mainImage shape from ABOUT_QUERY:
//   mainImage { alt, asset, "url": asset->url, "lqip": asset->metadata.lqip }
// The `asset` field is the canonical reference (NOT dereferenced) for urlFor().
// The `url` and `lqip` are top-level aliases resolved by GROQ at query time.
const FIXTURE_MAIN_IMAGE = {
  alt: 'Legacy photo',
  asset: {
    _type: 'reference' as const,
    _ref: 'image-main-800x600-jpg',
  },
  url: 'https://cdn.sanity.io/images/proj/prod/main.jpg',
  lqip: 'data:image/jpeg;base64,lqipmain',
};

const makeGalleryImage = (i: number, url = `https://cdn.sanity.io/img${i}.jpg`) => ({
  _key: `key-${i}`,
  _type: 'image' as const,
  alt: `Gallery image ${i}`,
  url,
  lqip: `data:image/jpeg;base64,lqip${i}`,
  asset: {
    _type: 'reference' as const,
    _ref: `image-gallery${i}-800x600-jpg`,
    url,
  },
});

// ─── Story 9: galleryImages → galleryItems ────────────────────────────────────

describe('buildAboutSanityState — Story 9: gallery normalization', () => {
  // Task 2.1: 0 galleryImages + valid mainImage → first gallery item of kind 'image' (padded to MIN_GALLERY_SLOTS)
  it('with 0 galleryImages and valid mainImage returns first gallery item of kind image', () => {
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      mainImage: FIXTURE_MAIN_IMAGE,
      mainImageAlt: 'Legacy photo',
      galleryImages: [],
    };

    const state = buildAboutSanityState(aboutPost);

    // First item is the legacy mainImage as an image item
    expect(state.galleryItems![0].kind).toBe('image');
    // Remaining slots are padded with placeholders to reach MIN_GALLERY_SLOTS
    expect(state.galleryItems!.length).toBeGreaterThanOrEqual(1);
    const imageItems = state.galleryItems!.filter(i => i.kind === 'image');
    expect(imageItems).toHaveLength(1);
  });

  // Task 2.2: 6 galleryImages → 6 items, each variant = index % 4
  it('with 6 galleryImages returns 6 gallery items each with variant = index % 4', () => {
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      mainImageAlt: undefined,
      galleryImages: [0, 1, 2, 3, 4, 5].map(i => makeGalleryImage(i)),
    };

    const state = buildAboutSanityState(aboutPost);

    expect(state.galleryItems).toHaveLength(6);
    state.galleryItems!.forEach((item, i) => {
      expect(item.kind).toBe('image');
      expect(item.variant).toBe(i % 4);
    });
  });

  // Task 2.3: items with missing/unresolvable url are filtered out
  it('filters out items with missing url and keeps remaining valid items', () => {
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [
        makeGalleryImage(0),                                          // valid
        { ...makeGalleryImage(1), url: '' },                         // empty url → filtered
        { ...makeGalleryImage(2), url: undefined as unknown as string }, // no url → filtered
        makeGalleryImage(3),                                          // valid
      ],
    };

    const state = buildAboutSanityState(aboutPost);

    // Only the 2 valid items survive; placeholders pad to 4
    const imageItems = state.galleryItems!.filter(i => i.kind === 'image');
    expect(imageItems).toHaveLength(2);
    // Variants are re-indexed from 0 for the surviving items
    expect(imageItems[0].variant).toBe(0);
    expect(imageItems[1].variant).toBe(1);
  });

  // Task 2.4: when valid images total < 4, placeholders pad to at least 4 slots
  it('pads galleryItems with placeholders when valid images count < 4', () => {
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [makeGalleryImage(0), makeGalleryImage(1)],
    };

    const state = buildAboutSanityState(aboutPost);

    expect(state.galleryItems!.length).toBeGreaterThanOrEqual(4);
    const placeholders = state.galleryItems!.filter(i => i.kind === 'placeholder');
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
    // Placeholder variants cycle correctly
    expect(placeholders[0].variant).toBe(2);
    expect(placeholders[1].variant).toBe(3);
  });

  // Task 2.5: null/undefined input returns { galleryItems: [] } without crash
  it('returns empty galleryItems for null input without crashing', () => {
    const state = buildAboutSanityState(null);

    expect(state.galleryItems).toBeDefined();
    expect(state.galleryItems).toHaveLength(0);
  });

  it('returns empty galleryItems for undefined input without crashing', () => {
    const state = buildAboutSanityState(undefined);

    expect(state.galleryItems).toBeDefined();
    expect(state.galleryItems).toHaveLength(0);
  });
});

// ─── Story 9: galleryItems image kind preserves fields ────────────────────────

describe('buildAboutSanityState — Story 9: image item field contract', () => {
  it('each image gallery item preserves key, url, alt, lqip, and source', () => {
    const img = makeGalleryImage(0);
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [img],
    };

    const state = buildAboutSanityState(aboutPost);

    const item = state.galleryItems!.find(i => i.kind === 'image');
    expect(item).toBeDefined();
    expect(item!.kind).toBe('image');
    expect(item!.key).toBe(img._key);
    expect((item as { kind: 'image'; url: string }).url).toBe(img.url);
    expect((item as { kind: 'image'; alt: string }).alt).toBe(img.alt);
    expect((item as { kind: 'image'; lqip?: string }).lqip).toBe(img.lqip);
  });
});

// ─── Story 9: exactly 4 images → no padding ───────────────────────────────────

describe('buildAboutSanityState — Story 9: 4 images exact', () => {
  it('with exactly 4 valid images returns 4 items and no placeholders', () => {
    const aboutPost = {
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [0, 1, 2, 3].map(i => makeGalleryImage(i)),
    };

    const state = buildAboutSanityState(aboutPost);

    expect(state.galleryItems).toHaveLength(4);
    state.galleryItems!.forEach(item => expect(item.kind).toBe('image'));
  });
});

// ─── Story 9: urlFor compatibility — source must preserve asset._ref ──────────
// Bug fix: runtime Sanity query projects asset->{...} which dereferences the
// asset, replacing the reference with the full asset document (has _id, no _ref).
// urlFor() requires asset._ref to build URLs; passing a dereferenced asset
// causes: "Malformed asset _ref ''. Expected an id like image-Tb9...-jpg".
//
// These tests simulate the real runtime shape: RawGalleryImage.asset is an
// expanded asset doc (has _id, no _ref). The mapper MUST reconstruct a
// canonical image reference for urlFor() from asset._id.

const makeGalleryImageDereferenced = (i: number, url = `https://cdn.sanity.io/img${i}.jpg`) => ({
  _key: `key-${i}`,
  _type: 'image' as const,
  alt: `Gallery image ${i}`,
  url,
  lqip: `data:image/jpeg;base64,lqip${i}`,
  // Simulates Sanity asset->{...} output: _id is set, _ref is absent
  asset: {
    _id: `image-gallery${i}-800x600-jpg`,
    _type: 'sanity.imageAsset' as const,
    url,
  },
});

describe('buildAboutSanityState — Story 9: urlFor source contract (bug fix)', () => {
  it('image item source has a valid asset._ref when asset comes from reference (standard shape)', () => {
    // The standard shape: asset is a reference { _type: 'reference', _ref: '...' }
    const img = makeGalleryImage(0);
    const state = buildAboutSanityState({
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [img],
    });

    const item = state.galleryItems.find(i => i.kind === 'image');
    expect(item).toBeDefined();
    // Cast to access source internals
    const source = (item as { kind: 'image'; source: Record<string, unknown> }).source;
    const asset = source.asset as Record<string, unknown>;
    // urlFor needs a non-empty _ref to build URLs
    expect(typeof asset._ref).toBe('string');
    expect((asset._ref as string).length).toBeGreaterThan(0);
  });

  it('image item source has a valid asset._ref reconstructed from asset._id (dereferenced shape)', () => {
    // This is the runtime shape after Sanity's asset->{...} dereference:
    // asset has _id but not _ref. The mapper must reconstruct _ref from _id.
    const img = makeGalleryImageDereferenced(7);
    const state = buildAboutSanityState({
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [img],
    });

    const item = state.galleryItems.find(i => i.kind === 'image');
    expect(item).toBeDefined();
    const source = (item as { kind: 'image'; source: Record<string, unknown> }).source;
    const asset = source.asset as Record<string, unknown>;
    // Must have a non-empty _ref so urlFor() doesn't throw
    expect(typeof asset._ref).toBe('string');
    expect((asset._ref as string).length).toBeGreaterThan(0);
    // _ref must equal the original asset._id
    expect(asset._ref).toBe('image-gallery7-800x600-jpg');
  });

  it('urlFor does not throw when called with the source from a dereferenced asset', () => {
    // End-to-end: createUrlFor with the source produced by the mapper must not throw
    const urlForTest = createUrlFor({ projectId: 'testproj', dataset: 'production' });

    const img = makeGalleryImageDereferenced(3);
    const state = buildAboutSanityState({
      _id: 'test-id',
      _type: 'aboutPost' as const,
      galleryImages: [img],
    });

    const item = state.galleryItems.find(i => i.kind === 'image');
    expect(item).toBeDefined();
    const source = (item as { kind: 'image'; source: unknown }).source;

    expect(() => urlForTest(source).width(360).height(600).url()).not.toThrow();
  });
});

// ─── Story 9 / Data-shape fix: buildAboutSanityStateFromPosts ─────────────────
// Root cause: the Sanity dataset has 2 aboutPost documents, both with
// galleryImages:null and mainImage set. The old ABOUT_QUERY used [0] which only
// fetched one document, silently dropping the second image.
//
// OPTION B fix: ABOUT_QUERY returns ALL aboutPost docs. A new function
// `buildAboutSanityStateFromPosts(posts: AboutPost[])` aggregates the mainImage
// from each document into a gallery item. This preserves urlFor() in the render
// path (each item gets a canonical SanityImageSource built from asset._ref).
//
// The raw Sanity mainImage has this shape (from the production dataset):
//   mainImage: { _type: 'image', alt: '...', asset: { _ref: '...', _type: 'reference' } }
// Note: alt lives INSIDE mainImage, not in a separate mainImageAlt field.

// Build a fixture that mirrors the GROQ-projected mainImage shape from ABOUT_QUERY.
// The query aliases "url": asset->url and "lqip": asset->metadata.lqip alongside
// the canonical asset reference. Tests must include these to match the runtime shape.
const makePostMainImage = (i: number) => ({
  alt: `Photo ${i}`,
  asset: {
    _type: 'reference' as const,
    _ref: `image-post${i}-1000x1000-jpg`,
  },
  url: `https://cdn.sanity.io/images/proj/prod/post${i}.jpg`,
  lqip: `data:image/jpeg;base64,lqip${i}`,
});

const makeAboutPost = (i: number) => ({
  _id: `post-${i}`,
  _type: 'aboutPost' as const,
  mainImage: makePostMainImage(i),
  mainImageAlt: undefined as string | undefined,
  galleryImages: undefined as undefined,
});

describe('buildAboutSanityStateFromPosts — multi-document aggregation', () => {
  // RED: function does not exist yet — this test must fail first

  it('empty array returns empty galleryItems', () => {
    const state = buildAboutSanityStateFromPosts([]);
    expect(state.galleryItems).toBeDefined();
    expect(state.galleryItems).toHaveLength(0);
  });

  it('single post with mainImage returns 1 image gallery item', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(0)]);
    const imageItems = state.galleryItems.filter(i => i.kind === 'image');
    expect(imageItems).toHaveLength(1);
    expect(imageItems[0].kind).toBe('image');
  });

  it('two posts each with mainImage return 2 image gallery items', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(0), makeAboutPost(1)]);
    const imageItems = state.galleryItems.filter(i => i.kind === 'image');
    expect(imageItems).toHaveLength(2);
  });

  it('each image item variant cycles 0→1 for two images', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(0), makeAboutPost(1)]);
    const imageItems = state.galleryItems.filter(i => i.kind === 'image');
    expect(imageItems[0].variant).toBe(0);
    expect(imageItems[1].variant).toBe(1);
  });

  it('alt text comes from mainImage.alt on each document', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(3)]);
    const imageItem = state.galleryItems.find(i => i.kind === 'image');
    expect(imageItem).toBeDefined();
    expect((imageItem as { kind: 'image'; alt: string }).alt).toBe('Photo 3');
  });

  it('fewer than 4 valid images are padded with placeholders to reach 4 slots', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(0), makeAboutPost(1)]);
    expect(state.galleryItems.length).toBeGreaterThanOrEqual(4);
    const placeholders = state.galleryItems.filter(i => i.kind === 'placeholder');
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });

  it('image item source has valid asset._ref for urlFor()', () => {
    const state = buildAboutSanityStateFromPosts([makeAboutPost(5)]);
    const imageItem = state.galleryItems.find(i => i.kind === 'image');
    expect(imageItem).toBeDefined();
    const source = (imageItem as { kind: 'image'; source: Record<string, unknown> }).source;
    const asset = source.asset as Record<string, unknown>;
    expect(typeof asset._ref).toBe('string');
    expect((asset._ref as string).length).toBeGreaterThan(0);
    expect(asset._ref).toBe('image-post5-1000x1000-jpg');
  });

  it('urlFor does not throw with source produced from post mainImage', () => {
    const urlForTest = createUrlFor({ projectId: 'testproj', dataset: 'production' });
    const state = buildAboutSanityStateFromPosts([makeAboutPost(0)]);
    const imageItem = state.galleryItems.find(i => i.kind === 'image');
    const source = (imageItem as { kind: 'image'; source: unknown }).source;
    expect(() => urlForTest(source).width(360).height(600).url()).not.toThrow();
  });

  it('post without mainImage is skipped gracefully', () => {
    const postWithNoImage = {
      _id: 'post-empty',
      _type: 'aboutPost' as const,
      mainImage: undefined,
      mainImageAlt: undefined,
      galleryImages: undefined,
    };
    const state = buildAboutSanityStateFromPosts([postWithNoImage]);
    const imageItems = state.galleryItems.filter(i => i.kind === 'image');
    expect(imageItems).toHaveLength(0);
  });
});
