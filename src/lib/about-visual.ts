/**
 * Visual design constants and pure utility functions for the About gallery.
 *
 * Story 5: UI visual premium de la sección.
 * Story 7: Scroll-linked horizontal gallery — adds breakpoint constant, scroll
 *           progress helpers, and GalleryMetrics interface.
 *
 * Centralises the design-token mapping that was previously inlined in
 * `AboutSection.astro`. Extracting these to a pure, tested module:
 *   - Makes the constants unit-testable (they were previously untested inline code)
 *   - Enforces the fixed 360×600 card dimension contract at the type level
 *   - Provides a single source of truth for variant CSS classes and placeholder tones
 *
 * All exports are pure (no side effects, no runtime dependencies).
 */

/**
 * Fixed card width in pixels — acceptance criterion for Story 5.
 * Cards in the About gallery are always exactly 360px wide.
 */
export const CARD_WIDTH = 360 as const;

/**
 * Fixed card height in pixels — acceptance criterion for Story 5.
 * Cards in the About gallery are always exactly 600px tall.
 */
export const CARD_HEIGHT = 600 as const;

/**
 * Ordered list of visual variant names for the 4-slot gallery cadence.
 * Index maps directly to the `variant` field on `AboutGalleryItem`.
 *
 *   0 → primary    (no offset — base position)
 *   1 → secondary  (offset down by 48px on desktop)
 *   2 → tertiary   (offset down by 12px on desktop)
 *   3 → quaternary (offset down by 64px on desktop)
 */
export const VARIANT_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
] as const;

export type VariantName = (typeof VARIANT_NAMES)[number];
export type VariantIndex = 0 | 1 | 2 | 3;

/**
 * Ordered list of dark background tones for placeholder gallery slots.
 * Each tone corresponds to its variant index position, creating a subtle
 * depth gradient when placeholders are displayed during image loading or
 * when images are not yet available from the CMS.
 */
export const PLACEHOLDER_TONES = [
  '#2A2A2A', // primary
  '#222222', // secondary
  '#1E1E1E', // tertiary
  '#191919', // quaternary
] as const;

export type PlaceholderTone = (typeof PLACEHOLDER_TONES)[number];

/**
 * Returns the BEM modifier CSS class for an About card at the given variant index.
 *
 * Used to apply stagger offset styles defined in `AboutSection.astro` <style>:
 *   .about-card--secondary   { margin-top: 48px }
 *   .about-card--tertiary    { margin-top: 12px }
 *   .about-card--quaternary  { margin-top: 64px }
 *
 * @param variant - Visual slot index (0–3)
 * @returns BEM modifier class string, e.g. "about-card--primary"
 */
export function getVariantClassName(variant: VariantIndex): string {
  return `about-card--${VARIANT_NAMES[variant]}`;
}

/**
 * Returns the dark background tone for a placeholder card at the given variant index.
 *
 * @param variant - Visual slot index (0–3)
 * @returns Hex color string, e.g. "#2A2A2A"
 */
export function getPlaceholderTone(variant: VariantIndex): PlaceholderTone {
  return PLACEHOLDER_TONES[variant];
}

// ─── Story 7: Scroll-linked gallery helpers ────────────────────────────────────

/**
 * Minimum viewport width (inclusive) at which the scroll-linked horizontal
 * gallery is activated. Below this breakpoint, native horizontal scroll is used.
 */
export const DESKTOP_BREAKPOINT = 1024 as const;

/**
 * Intermediate metrics computed by the scroll-linked gallery island.
 * Consumed by the island to drive transform and fade state on each scroll tick.
 *
 * @field maxOffset — Maximum pixels the track can travel horizontally
 *                    (trackWidth - viewportWidth, always ≥ 0).
 * @field stickyHeight — Viewport height used as the sticky stage height.
 * @field progress — Normalised scroll progress in the range [0, 1].
 */
export interface GalleryMetrics {
  maxOffset: number;
  stickyHeight: number;
  progress: number;
}

/**
 * Converts the section's `getBoundingClientRect().top` into a normalised
 * scroll progress value clamped to [0, 1].
 *
 * The sticky-stage design gives: progress = -top / max(maxOffset, 1).
 * Positive `top` means the section hasn't entered yet → clamped to 0.
 * A very negative `top` means the section exited → clamped to 1.
 *
 * @param top       — `stageRef.current.getBoundingClientRect().top` (may be negative)
 * @param maxOffset — Maximum horizontal travel distance in pixels (≥ 0)
 * @returns Normalised progress in [0, 1]
 */
export function clampProgress(top: number, maxOffset: number): number {
  const divisor = Math.max(maxOffset, 1);
  const raw = -top / divisor;
  return Math.min(1, Math.max(0, raw));
}

/**
 * Converts a container's `scrollLeft` into a normalised progress value [0, 1].
 *
 * Used by the wheel-driven horizontal gallery on desktop to derive fade state.
 * `maxScrollLeft = container.scrollWidth - container.clientWidth` (always ≥ 0).
 *
 * @param scrollLeft    — Current horizontal scroll position (≥ 0)
 * @param maxScrollLeft — Maximum scrollable distance (≥ 0)
 * @returns Normalised progress in [0, 1]
 */
export function clampScrollProgress(scrollLeft: number, maxScrollLeft: number): number {
  const divisor = Math.max(maxScrollLeft, 1);
  const raw = scrollLeft / divisor;
  return Math.min(1, Math.max(0, raw));
}

/**
 * Derives which edge fades are visible based on the current scroll progress.
 *
 * - `showStart` (leading edge): true when progress > 0 (content has scrolled past left edge)
 * - `showEnd` (trailing edge): true when progress < 1 (more content remains at right edge)
 *
 * Both are hidden at their respective boundaries (start: 0, end: 1) to avoid
 * showing a fade overlay against a flush edge.
 *
 * @param progress — Normalised scroll progress in [0, 1]
 * @returns Edge fade visibility flags
 */
export function getFadeState(progress: number): { showStart: boolean; showEnd: boolean } {
  return {
    showStart: progress > 0,
    showEnd: progress < 1,
  };
}
