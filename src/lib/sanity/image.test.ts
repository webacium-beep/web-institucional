/**
 * Tests for the Sanity image URL builder helper.
 *
 * Strategy: `createUrlFor(config)` is a pure factory returning a `urlFor`
 * function that can be tested with a mock config — no import.meta.env reads.
 *
 * The module-level `urlFor` export (singleton) is covered by the SSR
 * integration contract (tsc + pnpm dev startup).
 */

import { describe, it, expect } from 'vitest';
import { createUrlFor } from './image';

const MOCK_CONFIG = {
  projectId: 'testproject',
  dataset: 'production',
} as const;

const FIXTURE_IMAGE_REF = {
  _type: 'image' as const,
  asset: {
    _type: 'reference' as const,
    _ref: 'image-abc123def456-800x600-jpg',
  },
};

// ─── createUrlFor — pure factory behavior ─────────────────────────────────────

describe('createUrlFor — pure factory returns a urlFor helper', () => {
  it('returned urlFor produces a cdn.sanity.io URL for a valid image ref', () => {
    const urlFor = createUrlFor(MOCK_CONFIG);

    const url = urlFor(FIXTURE_IMAGE_REF).url();

    expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });

  it('CDN URL contains the projectId from the provided config', () => {
    const urlFor = createUrlFor(MOCK_CONFIG);

    const url = urlFor(FIXTURE_IMAGE_REF).url();

    expect(url).toContain('testproject');
  });

  it('CDN URL contains the dataset from the provided config', () => {
    const urlFor = createUrlFor(MOCK_CONFIG);

    const url = urlFor(FIXTURE_IMAGE_REF).url();

    expect(url).toContain('production');
  });

  it('different configs produce different CDN URL prefixes (triangulation)', () => {
    const urlForA = createUrlFor({ projectId: 'projectA', dataset: 'staging' });
    const urlForB = createUrlFor({ projectId: 'projectB', dataset: 'production' });

    const urlA = urlForA(FIXTURE_IMAGE_REF).url();
    const urlB = urlForB(FIXTURE_IMAGE_REF).url();

    expect(urlA).toContain('projectA');
    expect(urlA).toContain('staging');
    expect(urlB).toContain('projectB');
    expect(urlB).toContain('production');
    // Must be different URLs
    expect(urlA).not.toBe(urlB);
  });

  it('supports chaining — .width() applies before .url()', () => {
    const urlFor = createUrlFor(MOCK_CONFIG);

    const url = urlFor(FIXTURE_IMAGE_REF).width(800).url();

    // Width param is appended as a query string by the CDN builder
    expect(url).toContain('w=800');
    expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });
});
