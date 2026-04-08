/**
 * Sanity bootstrap configuration.
 *
 * Reads environment values, validates that required public config is present,
 * and throws an explicit setup error before any Sanity request is attempted
 * when the configuration is incomplete.
 *
 * Server-only values (e.g. SANITY_API_TOKEN) are intentionally not prefixed
 * with PUBLIC_ — they must never be bundled into browser code.
 *
 * Architecture note: `requireEnv` and `buildSanityConfig` are exported as
 * pure functions (accepting an explicit env map) so they can be unit-tested
 * without import.meta.env. The module-level `sanityConfig` singleton is
 * lazy-initialized (first access) so that unit tests can import pure helpers
 * without triggering env reads. SSR code hits the singleton via `client.ts`
 * and `image.ts`, which are only imported at server request time.
 */

import { SANITY_API_VERSION_FALLBACK } from './constants';

/**
 * Pure helper: reads a required string from the provided env map.
 * Throws an explicit setup error when the key is absent or blank.
 *
 * @param key  - Environment variable name.
 * @param env  - Env map to read from (defaults to import.meta.env for SSR use).
 */
export function requireEnv(
  key: string,
  env: Record<string, string | undefined> = import.meta.env as Record<string, string | undefined>,
): string {
  const value = env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `[Sanity setup] Missing required environment variable: "${key}". ` +
        'Check your .env file against .env.example.',
    );
  }
  return value.trim();
}

/**
 * Pure factory: constructs a Sanity config object from the provided env map.
 * Throws if required variables are missing. Safe to call in tests.
 *
 * @param env - Env map (defaults to import.meta.env for SSR use).
 */
export function buildSanityConfig(
  env: Record<string, string | undefined> = import.meta.env as Record<string, string | undefined>,
) {
  return {
    projectId: requireEnv('PUBLIC_SANITY_PROJECT_ID', env),
    dataset: requireEnv('PUBLIC_SANITY_DATASET', env),
    apiVersion: (env['SANITY_API_VERSION'] ?? '').trim() || SANITY_API_VERSION_FALLBACK,
    /**
     * Server-only token — undefined for anonymous reads.
     * Never expose this value to browser code.
     */
    token: (env['SANITY_API_TOKEN'] ?? '').trim() || undefined,
  } as const;
}

export type SanityConfig = ReturnType<typeof buildSanityConfig>;

// ─── Lazy singleton ───────────────────────────────────────────────────────────
// Initialized on first access so unit tests that import only pure helpers do
// not trigger env reads. In SSR, the singleton is accessed via client.ts and
// image.ts which are only evaluated on the server during request handling.

let _sanityConfig: SanityConfig | undefined;

/**
 * Singleton Sanity config, lazy-initialized on first access.
 * Throws immediately if PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET
 * are missing — misconfiguration is caught at the first Sanity access, not
 * at server startup, but still before any Sanity query reaches the network.
 */
export function getSanityConfig(): SanityConfig {
  if (!_sanityConfig) {
    _sanityConfig = buildSanityConfig();
  }
  return _sanityConfig;
}

/**
 * Eager singleton for convenience — equivalent to `getSanityConfig()`.
 * Only safe to use in SSR module scope (Astro pages, server routes).
 * Do NOT reference this from browser-only code or test files.
 *
 * @deprecated Prefer `getSanityConfig()` for explicit lazy access, or use
 *   `buildSanityConfig(env)` in tests with a mock env map.
 */
export const sanityConfig = {
  get projectId() { return getSanityConfig().projectId; },
  get dataset() { return getSanityConfig().dataset; },
  get apiVersion() { return getSanityConfig().apiVersion; },
  get token() { return getSanityConfig().token; },
} satisfies Record<keyof SanityConfig, unknown>;
