/**
 * Shared Sanity image URL builder.
 *
 * Bootstrap strategy: resolve image references to direct Sanity CDN URLs.
 * Astro remote image optimisation is explicitly deferred — Story 3 does not
 * configure `astro.config.mjs` image domains.
 *
 * Architecture note: `createUrlFor(config)` is a pure factory exported for
 * testability. The module-level `urlFor` export is a lazy proxy that reads
 * env config on first call (SSR only). Unit tests use `createUrlFor` with a
 * mock config object and never trigger import.meta.env reads.
 *
 * Usage (SSR):
 *   import { urlFor } from '$lib/sanity/image';
 *   const src = urlFor(post.mainImage).width(800).url();
 *
 * Usage (tests):
 *   import { createUrlFor } from '$lib/sanity/image';
 *   const urlFor = createUrlFor({ projectId: 'test', dataset: 'test' });
 */

import { createImageUrlBuilder } from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from './types';
import { getSanityConfig } from './config';

type ImageConfig = { projectId: string; dataset: string };

/**
 * Pure factory: returns a `urlFor(source)` helper configured for the provided
 * projectId/dataset pair. Safe to call in tests — no import.meta.env reads.
 */
export function createUrlFor(config: ImageConfig): (source: SanityImageSource) => ImageUrlBuilder {
  const builder = createImageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  });
  return (source: SanityImageSource) => builder.image(source);
}

// ─── Lazy singleton ───────────────────────────────────────────────────────────

let _urlFor: ((source: SanityImageSource) => ImageUrlBuilder) | undefined;

function getUrlFor(): (source: SanityImageSource) => ImageUrlBuilder {
  if (!_urlFor) {
    const cfg = getSanityConfig();
    _urlFor = createUrlFor({ projectId: cfg.projectId, dataset: cfg.dataset });
  }
  return _urlFor;
}

/**
 * Returns an image URL builder instance for the given Sanity image source.
 * Chain `.width()`, `.height()`, `.fit()`, etc. and call `.url()` for the
 * final CDN URL string.
 *
 * Lazy-initialized on first call — safe to import in any SSR module without
 * triggering env reads at import time.
 *
 * @example
 *   urlFor(post.mainImage).width(800).auto('format').url()
 */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return getUrlFor()(source);
}
