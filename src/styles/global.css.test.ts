/**
 * Tests for Story 6 CSS animation definitions in global.css
 *
 * Story 6 (revised — scroll scrubbing): The h2 animation is now driven entirely
 * by inline styles via a JavaScript scroll event listener. The CSS @keyframes
 * and @utility animate-fade-up are NOT used — they have been removed.
 *
 * What remains:
 * 1. @keyframes fade-up — REMOVED (no longer needed; inline styles replace it)
 * 2. @utility animate-fade-up — REMOVED (no longer needed)
 * 3. prefers-reduced-motion — handled in JS (checks matchMedia in scroll listener)
 *
 * Strategy: CSS declaration presence tests (configuration correctness).
 * We verify the old CSS animation artifacts have been removed so there is no
 * confusion between the removed CSS approach and the new JS scrubbing approach.
 *
 * NOTE: The scroll-scrubbing logic lives entirely in AboutSection.astro <script>.
 *       global.css no longer participates in the animation.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const CSS_PATH = resolve(__dirname, './global.css');

describe('global.css — Story 6 (scroll-scrubbing, CSS animation removed)', () => {
  let cssContent: string;

  beforeAll(() => {
    cssContent = readFileSync(CSS_PATH, 'utf-8');
  });

  describe('animate-fade-up CSS animation removed (replaced by inline JS scrubbing)', () => {
    it('does NOT declare @utility animate-fade-up (removed — inline styles used instead)', () => {
      // The CSS animation utility is no longer used; scroll scrubbing uses style.transform/opacity
      expect(cssContent).not.toMatch(/@utility\s+animate-fade-up/);
    });

    it('does NOT declare @keyframes fade-up (removed — no CSS animation needed)', () => {
      // @keyframes fade-up was used by animate-fade-up; both removed together
      expect(cssContent).not.toMatch(/@keyframes\s+fade-up/);
    });

    it('does NOT declare animation-timeline: view() (Chrome-only, was never used)', () => {
      // Verify the CSS-only scroll-driven animation approach was never added
      expect(cssContent).not.toMatch(/animation-timeline\s*:\s*view\s*\(/);
    });
  });

  describe('font and utility declarations still present', () => {
    it('still imports tailwindcss', () => {
      expect(cssContent).toContain('@import "tailwindcss"');
    });

    it('still declares @font-face for Avenir', () => {
      expect(cssContent).toMatch(/@font-face/);
    });

    it('still declares text-titulo utility', () => {
      expect(cssContent).toMatch(/@utility\s+text-titulo/);
    });
  });
});
