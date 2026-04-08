/**
 * Reusable Sanity client for Astro SSR.
 *
 * This module is server-safe: `sanityClient` is lazy-initialized on first
 * access so unit tests can import `createSanityClient` without triggering
 * env reads.
 * Never import this file from browser-only code or React islands.
 *
 * Architecture note: `createSanityClient(config)` is a pure factory exported
 * for testability. The module-level `sanityClient` singleton calls it with the
 * lazy `getSanityConfig()` on first use (SSR request handling).
 */

import { createClient, type SanityClient } from '@sanity/client';
import { getSanityConfig, type SanityConfig } from './config';

/**
 * Pure factory: creates a configured Sanity client from an explicit config.
 * Safe to call in tests — no import.meta.env reads.
 */
export function createSanityClient(config: SanityConfig): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    token: config.token,
    /**
     * useCdn: false — always request fresh data from the Sanity API in SSR.
     * Flip to true in production if CDN-cached reads are acceptable for your
     * content freshness requirements.
     */
    useCdn: false,
  });
}

// ─── Lazy singleton ───────────────────────────────────────────────────────────

let _sanityClient: SanityClient | undefined;

/**
 * Singleton Sanity client, lazy-initialized on first access.
 * In SSR, this is called by Astro pages during request handling.
 */
export function getSanityClient(): SanityClient {
  if (!_sanityClient) {
    _sanityClient = createSanityClient(getSanityConfig());
  }
  return _sanityClient;
}

/**
 * Module-level convenience export.
 * Proxy that delegates to the lazy singleton — safe to use in Astro SSR pages.
 * Do NOT reference from browser-only code or test files.
 */
export const sanityClient: SanityClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const value = getSanityClient()[prop as keyof SanityClient];

    return typeof value === 'function' ? value.bind(getSanityClient()) : value;
  },
});
