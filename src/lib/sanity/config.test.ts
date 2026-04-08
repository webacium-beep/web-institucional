/**
 * Tests for Sanity config bootstrap behaviors.
 *
 * Strategy: `requireEnv` and `buildSanityConfig` are extracted as pure functions
 * (accepting an env map) so they can be tested without import.meta.env.
 *
 * The module-level `sanityConfig` is covered by the SSR integration contract
 * (tsc --noEmit + pnpm dev startup).
 */

import { describe, it, expect } from 'vitest';
import { requireEnv, buildSanityConfig } from './config';
import { SANITY_API_VERSION_FALLBACK } from './constants';

// ─── requireEnv — fail-fast behavior ─────────────────────────────────────────

describe('requireEnv — fail-fast on missing env', () => {
  it('throws an explicit setup error when the key is absent from the env map', () => {
    const env: Record<string, string | undefined> = {};

    expect(() => requireEnv('PUBLIC_SANITY_PROJECT_ID', env)).toThrow(
      '[Sanity setup] Missing required environment variable: "PUBLIC_SANITY_PROJECT_ID"',
    );
  });

  it('throws when the env value is an empty string', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: '',
    };

    expect(() => requireEnv('PUBLIC_SANITY_PROJECT_ID', env)).toThrow(
      '[Sanity setup] Missing required environment variable: "PUBLIC_SANITY_PROJECT_ID"',
    );
  });

  it('throws when the env value is whitespace-only', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: '   ',
    };

    expect(() => requireEnv('PUBLIC_SANITY_PROJECT_ID', env)).toThrow(
      '[Sanity setup] Missing required environment variable: "PUBLIC_SANITY_PROJECT_ID"',
    );
  });

  it('returns the trimmed value when the key is present and non-empty', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: '  myprojectid  ',
    };

    const result = requireEnv('PUBLIC_SANITY_PROJECT_ID', env);

    expect(result).toBe('myprojectid');
  });

  it('works for any key — not hardcoded to project ID (triangulation)', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_DATASET: 'production',
    };

    const result = requireEnv('PUBLIC_SANITY_DATASET', env);

    expect(result).toBe('production');
  });
});

// ─── buildSanityConfig — valid-config behavior ────────────────────────────────

describe('buildSanityConfig — constructs config from valid env', () => {
  it('builds config with all required fields from a complete env map', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: 'myproject',
      PUBLIC_SANITY_DATASET: 'production',
      SANITY_API_VERSION: '2024-06-01',
      SANITY_API_TOKEN: 'mytoken',
    };

    const config = buildSanityConfig(env);

    expect(config.projectId).toBe('myproject');
    expect(config.dataset).toBe('production');
    expect(config.apiVersion).toBe('2024-06-01');
    expect(config.token).toBe('mytoken');
  });

  it('uses the fallback API version when SANITY_API_VERSION is absent', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: 'myproject',
      PUBLIC_SANITY_DATASET: 'staging',
      // SANITY_API_VERSION intentionally absent
    };

    const config = buildSanityConfig(env);

    expect(config.apiVersion).toBe(SANITY_API_VERSION_FALLBACK);
  });

  it('token is undefined when SANITY_API_TOKEN is absent (anonymous read)', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: 'myproject',
      PUBLIC_SANITY_DATASET: 'production',
    };

    const config = buildSanityConfig(env);

    expect(config.token).toBeUndefined();
  });

  it('throws when PUBLIC_SANITY_PROJECT_ID is missing', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_DATASET: 'production',
    };

    expect(() => buildSanityConfig(env)).toThrow(
      'PUBLIC_SANITY_PROJECT_ID',
    );
  });

  it('throws when PUBLIC_SANITY_DATASET is missing', () => {
    const env: Record<string, string | undefined> = {
      PUBLIC_SANITY_PROJECT_ID: 'myproject',
    };

    expect(() => buildSanityConfig(env)).toThrow(
      'PUBLIC_SANITY_DATASET',
    );
  });
});
