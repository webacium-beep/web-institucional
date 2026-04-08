/**
 * Reusable GROQ query constants for Sanity content reads.
 *
 * Define all GROQ strings here so query changes are centralised and
 * refactorable. Future stories add new constants without touching this
 * file's existing exports.
 */

/**
 * Fetches ALL `aboutPost` documents from the Sanity dataset.
 *
 * Story 4: explicit projection with mainImage.
 * Story 9: extends projection with galleryImages[] — the multi-image gallery
 * collection. Each image item exposes:
 *   - `_key`     — stable item key for React reconciliation
 *   - `alt`      — accessibility alt text
 *   - `"url"`    — aliased CDN URL derived from the asset reference
 *   - `"lqip"`   — aliased LQIP base64 from asset metadata
 *
 * Story 9 / data-shape fix:
 *   The Sanity dataset has MULTIPLE `aboutPost` documents, each with their own
 *   `mainImage`. Using `[0]` only fetched the first, silently dropping all other
 *   images. The query now returns all documents so every image appears in the gallery.
 *
 * IMPORTANT — urlFor() compatibility:
 *   The `asset` field inside `mainImage` is intentionally NOT dereferenced
 *   (no `asset->{...}` spread) — this preserves the canonical Sanity reference
 *   shape `{ _type, _ref }` which `@sanity/image-url` requires to build CDN URLs
 *   via `urlFor(source)`. Dereferencing replaces `_ref` with `_id`, causing:
 *     "Malformed asset _ref ''. Expected an id like 'image-Tb9Ew8...-jpg'"
 *   CDN URL and LQIP are aliased from the asset via `asset->url` and
 *   `asset->metadata.lqip` for convenience without destroying the reference.
 *
 *   Note: `alt` is projected from WITHIN the mainImage object because the
 *   dataset stores it there (`mainImage.alt`), not in the top-level `mainImageAlt`.
 *
 *   The legacy `mainImageAlt` and `galleryImages` projections are kept for
 *   backward compatibility with existing mapper logic.
 */
export const ABOUT_QUERY = `*[_type == "aboutPost"]{
  _id,
  mainImage {
    alt,
    asset,
    "url": asset->url,
    "lqip": asset->metadata.lqip
  },
  mainImageAlt,
  galleryImages[]{
    _key,
    alt,
    "url": asset->url,
    "lqip": asset->metadata.lqip
  }
}`;
