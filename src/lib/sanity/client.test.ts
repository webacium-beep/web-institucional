/**
 * Tests for the Sanity client factory.
 *
 * Strategy: `createSanityClient(config)` is a pure factory that accepts a
 * config object and returns a configured Sanity client. Testable without
 * import.meta.env — just pass a mock config.
 *
 * The module-level `sanityClient` singleton (which calls getSanityConfig())
 * is covered by the SSR integration contract (tsc + pnpm dev).
 */

import { describe, it, expect } from 'vitest';
import { createSanityClient } from './client';

const MOCK_CONFIG = {
  projectId: 'testproject',
  dataset: 'testdataset',
  apiVersion: '2024-01-01',
  token: undefined,
} as const;

// ─── createSanityClient — factory behavior ────────────────────────────────────

describe('createSanityClient — pure factory', () => {
  it('creates a Sanity client from a valid config object', () => {
    const client = createSanityClient(MOCK_CONFIG);

    // The @sanity/client SanityClient exposes config as `.config()`
    expect(client).toBeDefined();
    expect(typeof client.fetch).toBe('function');
  });

  it('client.config() reflects the projectId and dataset from the provided config', () => {
    const client = createSanityClient(MOCK_CONFIG);

    const cfg = client.config();

    expect(cfg.projectId).toBe('testproject');
    expect(cfg.dataset).toBe('testdataset');
  });

  it('useCdn is always false (SSR: fresh data, no CDN cache)', () => {
    const client = createSanityClient(MOCK_CONFIG);

    const cfg = client.config();

    expect(cfg.useCdn).toBe(false);
  });

  it('creates a distinct client for different configs (triangulation)', () => {
    const clientA = createSanityClient({ ...MOCK_CONFIG, projectId: 'projectA' });
    const clientB = createSanityClient({ ...MOCK_CONFIG, projectId: 'projectB' });

    expect(clientA.config().projectId).toBe('projectA');
    expect(clientB.config().projectId).toBe('projectB');
  });

  it('passes token through to the client config when provided', () => {
    const clientWithToken = createSanityClient({
      ...MOCK_CONFIG,
      token: 'sk-mytoken',
    });

    expect(clientWithToken.config().token).toBe('sk-mytoken');
  });

  it('exposes callable methods that stay bound to the client instance', () => {
    const client = createSanityClient(MOCK_CONFIG);
    const config = client.config;

    expect(() => config.call(client)).not.toThrow();
  });
});
