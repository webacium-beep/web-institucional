/**
 * Sanity configuration constants.
 *
 * Pure constants with no runtime dependencies (no import.meta.env reads).
 * Safe to import in Vitest/node environments and browser code.
 */

/**
 * Fallback API version used when SANITY_API_VERSION environment variable
 * is not set. Format: YYYY-MM-DD (Sanity Content Lake API versioning).
 */
export const SANITY_API_VERSION_FALLBACK = '2024-04-08';
