/**
 * Tests for About section visual utility functions.
 *
 * Story 5: UI visual premium de la sección.
 * These pure functions drive the design-token mapping for the About gallery:
 *   - getVariantClassName: maps variant index to CSS modifier class
 *   - getPlaceholderTone: maps variant index to dark background color
 *   - CARD_DIMENSIONS: fixed card size contract (360x600)
 *
 * Strategy: pure functions — no mocks needed. Triangulated against the full
 * 0–3 variant range plus an out-of-range guard.
 */
import { describe, it, expect } from 'vitest';
import {
  getVariantClassName,
  getPlaceholderTone,
  CARD_WIDTH,
  CARD_HEIGHT,
  VARIANT_NAMES,
  PLACEHOLDER_TONES,
  DESKTOP_BREAKPOINT,
  clampProgress,
  clampScrollProgress,
  getFadeState,
} from './about-visual';
import type { GalleryMetrics } from './about-visual';

// ─── CARD_DIMENSIONS ──────────────────────────────────────────────────────────

describe('CARD_DIMENSIONS — fixed 360x600 contract', () => {
  it('CARD_WIDTH equals 360', () => {
    expect(CARD_WIDTH).toBe(360);
  });

  it('CARD_HEIGHT equals 600', () => {
    expect(CARD_HEIGHT).toBe(600);
  });
});

// ─── VARIANT_NAMES ─────────────────────────────────────────────────────────────

describe('VARIANT_NAMES — 4 canonical slot names', () => {
  it('has exactly 4 entries', () => {
    expect(VARIANT_NAMES).toHaveLength(4);
  });

  it('variant 0 is "primary"', () => {
    expect(VARIANT_NAMES[0]).toBe('primary');
  });

  it('variant 3 is "quaternary"', () => {
    expect(VARIANT_NAMES[3]).toBe('quaternary');
  });
});

// ─── PLACEHOLDER_TONES ─────────────────────────────────────────────────────────

describe('PLACEHOLDER_TONES — 4 dark background tones', () => {
  it('has exactly 4 entries', () => {
    expect(PLACEHOLDER_TONES).toHaveLength(4);
  });

  it('all tones are non-empty strings', () => {
    PLACEHOLDER_TONES.forEach(tone => {
      expect(typeof tone).toBe('string');
      expect(tone.length).toBeGreaterThan(0);
    });
  });

  it('all tones start with #', () => {
    PLACEHOLDER_TONES.forEach(tone => {
      expect(tone.startsWith('#')).toBe(true);
    });
  });
});

// ─── getVariantClassName ───────────────────────────────────────────────────────

describe('getVariantClassName — maps variant to CSS class', () => {
  it('variant 0 returns "about-card--primary"', () => {
    expect(getVariantClassName(0)).toBe('about-card--primary');
  });

  it('variant 1 returns "about-card--secondary"', () => {
    expect(getVariantClassName(1)).toBe('about-card--secondary');
  });

  it('variant 2 returns "about-card--tertiary"', () => {
    expect(getVariantClassName(2)).toBe('about-card--tertiary');
  });

  it('variant 3 returns "about-card--quaternary"', () => {
    expect(getVariantClassName(3)).toBe('about-card--quaternary');
  });
});

// ─── getPlaceholderTone ────────────────────────────────────────────────────────

describe('getPlaceholderTone — maps variant to background color', () => {
  it('variant 0 returns a non-empty hex color', () => {
    const tone = getPlaceholderTone(0);
    expect(typeof tone).toBe('string');
    expect(tone.startsWith('#')).toBe(true);
    expect(tone.length).toBeGreaterThan(1);
  });

  it('variant 1 returns a different color than variant 0', () => {
    // Triangulate: four distinct dark tones, not all the same value
    expect(getPlaceholderTone(1)).not.toBe(getPlaceholderTone(0));
  });

  it('variant 2 returns a different color than variant 1', () => {
    expect(getPlaceholderTone(2)).not.toBe(getPlaceholderTone(1));
  });

  it('variant 3 returns a different color than variant 2', () => {
    expect(getPlaceholderTone(3)).not.toBe(getPlaceholderTone(2));
  });

  it('all four variant tones are unique', () => {
    const tones = ([0, 1, 2, 3] as const).map(v => getPlaceholderTone(v));
    const uniqueTones = new Set(tones);
    expect(uniqueTones.size).toBe(4);
  });
});

// ─── DESKTOP_BREAKPOINT ────────────────────────────────────────────────────────

describe('DESKTOP_BREAKPOINT — Story 7 breakpoint contract', () => {
  it('equals 1024', () => {
    expect(DESKTOP_BREAKPOINT).toBe(1024);
  });
});

// ─── GalleryMetrics ────────────────────────────────────────────────────────────
// Type-level: GalleryMetrics is verified via TypeScript's structural typing.
// The object below must satisfy the interface — if the interface is missing or
// fields are renamed, this block produces a compile-time / import error.

describe('GalleryMetrics — interface structural contract', () => {
  it('allows a well-formed GalleryMetrics object', () => {
    const metrics: GalleryMetrics = { maxOffset: 800, stickyHeight: 600, progress: 0.5 };
    expect(metrics.maxOffset).toBe(800);
    expect(metrics.stickyHeight).toBe(600);
    expect(metrics.progress).toBe(0.5);
  });
});

// ─── clampProgress ─────────────────────────────────────────────────────────────

describe('clampProgress — maps scroll offset to 0..1 progress', () => {
  it('returns 0 when top is 0 (section fully entering, no scroll)', () => {
    // At section entry, -top = 0, progress = clamp(0/maxOffset, 0, 1) = 0
    expect(clampProgress(0, 800)).toBe(0);
  });

  it('returns 1 when -top equals maxOffset (section fully traversed)', () => {
    // When scroll has covered the full offset distance: clamp(-(-800)/800, 0, 1) = 1
    expect(clampProgress(-800, 800)).toBe(1);
  });

  it('returns 0.5 for halfway through the section', () => {
    // Half of maxOffset traversed: clamp(-(-400)/800, 0, 1) = 0.5
    expect(clampProgress(-400, 800)).toBeCloseTo(0.5);
  });

  it('clamps below 0 — returns 0 when section is below viewport', () => {
    // top is positive: section is still below; progress should clamp to 0
    expect(clampProgress(100, 800)).toBe(0);
  });

  it('clamps above 1 — returns 1 when scroll overshoots', () => {
    // top far negative: section passed fully; progress should clamp to 1
    expect(clampProgress(-2000, 800)).toBe(1);
  });

  it('handles maxOffset = 0 without dividing by zero', () => {
    // When no offset (e.g., track fits entirely in viewport), result is 0 or clamped
    expect(clampProgress(0, 0)).toBe(0);
    expect(clampProgress(-50, 0)).toBe(1);
  });
});

// ─── clampScrollProgress ───────────────────────────────────────────────────────

describe('clampScrollProgress — maps scrollLeft to 0..1 progress for wheel UX', () => {
  it('returns 0 when scrollLeft is 0 (at gallery start)', () => {
    expect(clampScrollProgress(0, 800)).toBe(0);
  });

  it('returns 1 when scrollLeft equals maxScrollLeft (at gallery end)', () => {
    expect(clampScrollProgress(800, 800)).toBe(1);
  });

  it('returns 0.5 when halfway through', () => {
    expect(clampScrollProgress(400, 800)).toBeCloseTo(0.5);
  });

  it('clamps above 1 when scrollLeft exceeds maxScrollLeft', () => {
    expect(clampScrollProgress(1200, 800)).toBe(1);
  });

  it('clamps below 0 for negative scrollLeft (should not happen but guard it)', () => {
    expect(clampScrollProgress(-50, 800)).toBe(0);
  });

  it('handles maxScrollLeft = 0 without dividing by zero (returns 0)', () => {
    expect(clampScrollProgress(0, 0)).toBe(0);
    expect(clampScrollProgress(50, 0)).toBe(1);
  });
});

// ─── getFadeState ──────────────────────────────────────────────────────────────

describe('getFadeState — returns edge fade visibility based on scroll progress', () => {
  it('at progress 0 showEnd is true, showStart is false (at beginning)', () => {
    // At the start: trailing edge has content beyond; leading edge is empty
    const { showStart, showEnd } = getFadeState(0);
    expect(showStart).toBe(false);
    expect(showEnd).toBe(true);
  });

  it('at progress 1 showStart is true, showEnd is false (at end)', () => {
    // At the end: leading edge has content behind; trailing edge is clamped
    const { showStart, showEnd } = getFadeState(1);
    expect(showStart).toBe(true);
    expect(showEnd).toBe(false);
  });

  it('at progress 0.5 both showStart and showEnd are true (mid-scroll)', () => {
    // In the middle: content is present on both sides
    const { showStart, showEnd } = getFadeState(0.5);
    expect(showStart).toBe(true);
    expect(showEnd).toBe(true);
  });
});
