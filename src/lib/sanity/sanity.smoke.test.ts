/**
 * Sanity bootstrap smoke tests — Vitest (node environment).
 *
 * Scope: structural contracts that do NOT depend on Vite / import.meta.env.
 * Full SSR integration (env reading, client creation) is validated at
 * `pnpm dev` startup and by `tsc --noEmit` (zero errors).
 *
 * Migrated from: sanity.smoke.test.mjs (node:test runner)
 */

import { describe, it, expect } from 'vitest';
import { ABOUT_QUERY, LANZAMIENTOS_QUERY } from './queries';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SANITY_API_VERSION_FALLBACK } from './constants';
import type {
  AboutGalleryImage,
  AboutGalleryItem,
  AboutSectionSanityState,
  LanzamientosSectionSanityState,
} from './types';

// ─── Test 1: GROQ query constants ────────────────────────────────────────────

describe('GROQ query constants (queries.ts)', () => {
  it('ABOUT_QUERY is a non-empty string', () => {
    expect(typeof ABOUT_QUERY).toBe('string');
    expect(ABOUT_QUERY.length).toBeGreaterThan(0);
  });

  it('ABOUT_QUERY targets the aboutPost type', () => {
    expect(ABOUT_QUERY).toContain('"aboutPost"');
  });

  it('ABOUT_QUERY does NOT use [0] singleton selector — fetches all aboutPost documents', () => {
    // Story 9 / data-shape fix: the dataset has multiple aboutPost documents each with
    // mainImage. Using [0] silently drops all but the first. The query must return
    // the full collection so every image is visible in the gallery.
    expect(ABOUT_QUERY).not.toContain('[0]');
  });

  it('LANZAMIENTOS_QUERY targets the lanzamientosPost type', () => {
    expect(LANZAMIENTOS_QUERY).toContain('"lanzamientosPost"');
  });

  it('LANZAMIENTOS_QUERY uses a singleton [0] document selector', () => {
    expect(LANZAMIENTOS_QUERY).toContain('[0]');
  });

  it('LANZAMIENTOS_QUERY projects image candidates without dereferencing asset spreads', () => {
    expect(LANZAMIENTOS_QUERY).toContain('mainImage');
    expect(LANZAMIENTOS_QUERY).toContain('images[]{');
    expect(LANZAMIENTOS_QUERY).toContain('"url": asset->url');
    expect(LANZAMIENTOS_QUERY).toContain('"lqip": asset->metadata.lqip');
    expect(LANZAMIENTOS_QUERY).not.toMatch(/asset->\s*\{/);
  });
});

// ─── Test 1a2: ABOUT_QUERY mainImage alt projection (Story 9 fix) ─────────────

describe('ABOUT_QUERY mainImage alt projection (Story 9 fix)', () => {
  it('ABOUT_QUERY projects alt from within the mainImage object', () => {
    // The Sanity dataset stores alt text as mainImage.alt (inside the image),
    // not in a separate mainImageAlt field (which is null in the dataset).
    // The query must include alt in the mainImage projection for correct alt text.
    const mainImageSection = ABOUT_QUERY.slice(ABOUT_QUERY.indexOf('mainImage'));
    const nextSection = mainImageSection.indexOf('}');
    const mainImageBlock = mainImageSection.slice(0, nextSection + 1);
    expect(mainImageBlock).toContain('alt');
  });
});

// ─── Test 1b: ABOUT_QUERY projection fields (Story 4) ────────────────────────

describe('ABOUT_QUERY projection fields (Story 4)', () => {
  it('ABOUT_QUERY projects _id explicitly', () => {
    // Task 3.2: The query must include an explicit _id projection
    expect(ABOUT_QUERY).toContain('_id');
  });

  it('ABOUT_QUERY projects mainImage with asset sub-projection', () => {
    // Task 3.1: The query must project mainImage for image URL building
    expect(ABOUT_QUERY).toContain('mainImage');
    expect(ABOUT_QUERY).toContain('asset');
  });

  it('ABOUT_QUERY projects mainImageAlt', () => {
    // Task 3.1: The query must project mainImageAlt for accessibility
    expect(ABOUT_QUERY).toContain('mainImageAlt');
  });
});

// ─── Test 1c: ABOUT_QUERY projection fields (Story 9) ────────────────────────
// Task 1.3: assert galleryImages projection with _key, alt, asset dereference, lqip

describe('ABOUT_QUERY galleryImages projection fields (Story 9)', () => {
  it('ABOUT_QUERY projects galleryImages array', () => {
    expect(ABOUT_QUERY).toContain('galleryImages');
  });

  it('ABOUT_QUERY galleryImages projection includes _key', () => {
    expect(ABOUT_QUERY).toContain('_key');
  });

  it('ABOUT_QUERY galleryImages projection includes alt', () => {
    // Confirm alt is explicitly projected inside galleryImages
    const gallerySection = ABOUT_QUERY.slice(ABOUT_QUERY.indexOf('galleryImages'));
    expect(gallerySection).toContain('alt');
  });

  it('ABOUT_QUERY galleryImages projection includes lqip alias', () => {
    expect(ABOUT_QUERY).toContain('lqip');
  });

  it('ABOUT_QUERY galleryImages projection dereferences asset with url alias', () => {
    // The projection must dereference asset and expose a "url" alias
    const gallerySection = ABOUT_QUERY.slice(ABOUT_QUERY.indexOf('galleryImages'));
    expect(gallerySection).toContain('"url"');
    expect(gallerySection).toContain('asset');
  });

  it('ABOUT_QUERY galleryImages does NOT spread-dereference asset (urlFor compatibility)', () => {
    // Bug fix: asset->{...} replaces the Sanity reference with a full asset document
    // that lacks _ref, causing urlFor() to throw "Malformed asset _ref ''".
    // The canonical reference shape must be preserved so urlFor(source) works.
    // CDN URL and LQIP are aliased separately ("url": asset->url, "lqip": ...).
    const gallerySection = ABOUT_QUERY.slice(ABOUT_QUERY.indexOf('galleryImages'));
    // Must NOT contain a spread dereference of the asset inside galleryImages
    expect(gallerySection).not.toMatch(/asset->\s*\{/);
  });
});

// ─── Test 1d: Type contracts (Story 9) ───────────────────────────────────────
// Task 5.1: verify AboutGalleryImage, AboutGalleryItem, AboutSectionSanityState.galleryItems

describe('AboutGalleryImage type contract (Story 9)', () => {
  it('AboutGalleryImage is satisfied by a well-formed image payload', () => {
    const image: AboutGalleryImage = {
      key: 'img-key-1',
      variant: 0,
      source: {
        _type: 'image',
        asset: { _type: 'reference', _ref: 'image-abc123-800x600-jpg' },
      },
      url: 'https://cdn.sanity.io/images/proj/dataset/img.jpg',
      alt: 'About gallery image',
      lqip: 'data:image/jpeg;base64,/9j/abc',
    };
    expect(image.key).toBe('img-key-1');
    expect(image.variant).toBe(0);
    expect(image.url).toContain('cdn.sanity.io');
    expect(image.alt).toBe('About gallery image');
  });

  it('AboutGalleryImage allows lqip to be absent (optional field)', () => {
    const image: AboutGalleryImage = {
      key: 'img-key-2',
      variant: 2,
      source: {
        _type: 'image',
        asset: { _type: 'reference', _ref: 'image-xyz-jpg' },
      },
      url: 'https://cdn.sanity.io/images/proj/dataset/other.jpg',
      alt: '',
    };
    expect(image.lqip).toBeUndefined();
    expect(image.variant).toBe(2);
  });
});

describe('AboutGalleryItem union type contract (Story 9)', () => {
  it('AboutGalleryItem accepts an image item with kind=image', () => {
    const item: AboutGalleryItem = {
      kind: 'image',
      key: 'key-1',
      variant: 1,
      source: {
        _type: 'image',
        asset: { _type: 'reference', _ref: 'image-abc-jpg' },
      },
      url: 'https://cdn.sanity.io/img.jpg',
      alt: 'Team photo',
    };
    expect(item.kind).toBe('image');
    expect(item.variant).toBe(1);
  });

  it('AboutGalleryItem accepts a placeholder item with kind=placeholder', () => {
    const item: AboutGalleryItem = {
      kind: 'placeholder',
      key: 'placeholder-2',
      variant: 2,
    };
    expect(item.kind).toBe('placeholder');
    expect(item.variant).toBe(2);
  });
});

describe('AboutSectionSanityState galleryItems contract (Story 9)', () => {
  it('AboutSectionSanityState accepts galleryItems array', () => {
    const state: AboutSectionSanityState = {
      galleryItems: [
        {
          kind: 'placeholder',
          key: 'p-0',
          variant: 0,
        },
      ],
    };
    expect(state.galleryItems).toHaveLength(1);
    expect(state.galleryItems![0].kind).toBe('placeholder');
  });

  it('AboutSectionSanityState allows empty galleryItems', () => {
    const state: AboutSectionSanityState = { galleryItems: [] };
    expect(state.galleryItems).toHaveLength(0);
  });
});

describe('LanzamientosSectionSanityState contract', () => {
  it('supports a renderable image state', () => {
    const state: LanzamientosSectionSanityState = {
      hasImage: true,
      image: {
        url: 'https://cdn.sanity.io/images/proj/dataset/lanzamiento.jpg',
        alt: 'Nueva colección',
        source: {
          _type: 'image',
          asset: { _type: 'reference', _ref: 'image-launch-1200x800-jpg' },
        },
        lqip: 'data:image/jpeg;base64,launch',
      },
    };

    expect(state.hasImage).toBe(true);
    expect(state.image?.url).toContain('cdn.sanity.io');
  });

  it('supports placeholder fallback when no image is available', () => {
    const state: LanzamientosSectionSanityState = { hasImage: false };

    expect(state.hasImage).toBe(false);
    expect(state.image).toBeUndefined();
  });
});

// ─── Test 2: @sanity/image-url named export (non-deprecated API) ─────────────

describe('@sanity/image-url createImageUrlBuilder (named export)', () => {
  const FIXTURE_IMAGE_REF = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-abc123-800x600-jpg',
    },
  };

  it('createImageUrlBuilder accepts a config and produces a CDN URL for an image ref', () => {
    // Exercises the full chain: factory → .image() → .url()
    // This single behavioral test replaces three type-only assertions.
    const url = createImageUrlBuilder({
      projectId: 'testprojectid',
      dataset: 'production',
    })
      .image(FIXTURE_IMAGE_REF)
      .url();

    expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(url).toContain('testprojectid');
    expect(url).toContain('production');
  });

  it('CDN URL encodes the image asset ref in the path', () => {
    // Triangulation: different projectId/dataset → different URL prefix
    const url = createImageUrlBuilder({
      projectId: 'otherproject',
      dataset: 'staging',
    })
      .image(FIXTURE_IMAGE_REF)
      .url();

    expect(url).toContain('otherproject');
    expect(url).toContain('staging');
    // Sanity CDN URL pattern: https://cdn.sanity.io/images/{projectId}/{dataset}/...
    expect(url).toMatch(/\/images\/otherproject\/staging\//);
  });

  it('builder.image().url() produces a valid cdn.sanity.io URL (regression: deprecated default import would throw)', () => {
    // This explicitly verifies the named-export path works end-to-end.
    const url = createImageUrlBuilder({
      projectId: 'testprojectid',
      dataset: 'production',
    })
      .image(FIXTURE_IMAGE_REF)
      .url();

    expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });
});

// ─── Test 3: config fallback documented behaviour ─────────────────────────────

describe('SANITY_API_VERSION fallback', () => {
  it('fallback version string is a valid YYYY-MM-DD date', () => {
    // Exercises the actual constant from constants.ts — not a duplicated literal.
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    expect(SANITY_API_VERSION_FALLBACK).toMatch(dateRegex);

    const parsed = new Date(SANITY_API_VERSION_FALLBACK);
    expect(parsed.getTime()).not.toBeNaN();
  });

  it('fallback is in the past (a stable historic version, not a future date)', () => {
    // Triangulation: ensures the constant is a historic API version pin,
    // not an accidental future date that would be invalid.
    const fallbackDate = new Date(SANITY_API_VERSION_FALLBACK);
    const today = new Date();
    expect(fallbackDate.getTime()).toBeLessThan(today.getTime());
  });
});
