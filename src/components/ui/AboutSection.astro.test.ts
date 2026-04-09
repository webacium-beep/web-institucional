/**
 * Tests for Story 6 (revised) — AboutSection.astro scroll-scrubbing animation
 *
 * Verifies that the AboutSection template correctly:
 * 1. Applies `opacity-0` and `translate-y-[50px]` to the h2 on load (hidden on load).
 * 2. Includes a <script> block with a scroll-scrubbing effect:
 *    - Uses a `scroll` event listener (NOT IntersectionObserver).
 *    - Uses `getBoundingClientRect()` to calculate scroll progress.
 *    - Applies inline `style.transform` and `style.opacity` tied to scroll position.
 *    - Effect is bidirectional: scroll down → animate in, scroll up → animate out.
 * 3. Applies a hover color inversion (→ black bg / white text) to the subtitle div/button.
 *
 * Strategy: Static template content tests.
 * Astro files cannot be rendered in vitest (no Astro renderer).
 * We inspect the raw template content for the presence of the required classes
 * on the correct elements.
 *
 * Spec scenarios covered:
 *   "THEN the title MUST scrub with scroll (tied to scroll position, bidirectional)"
 *   "WHEN the user hovers over the subtitle div THEN bg inverts to black and text to white"
 *
 * This is analogous to configuration correctness testing.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, './AboutSection.astro');

describe('AboutSection.astro — Story 6 scroll-scrubbing animation', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  describe('h2 title initial hidden state (scroll-scrubbing approach)', () => {
    it('the h2 editorial title has opacity-0 as initial class (hidden on load)', () => {
      // h2 starts hidden; scroll position determines visibility
      const h2Match = templateContent.match(/<h2\s[^>]*>/);
      expect(h2Match).not.toBeNull();
      expect(h2Match![0]).toContain('opacity-0');
    });

    it('opacity-0 is on the h2 tag itself, not another element', () => {
      const h2Match = templateContent.match(/<h2\s([^>]*)>/);
      const classAttr = h2Match?.[1] ?? '';
      expect(classAttr).toContain('opacity-0');
    });

    it('the h2 has translate-y-[50px] as initial class (starts below position)', () => {
      // Scroll-scrubbing: starts 50px below, moves to 0 as you scroll down
      const h2Match = templateContent.match(/<h2\s([^>]*)>/);
      const classAttr = h2Match?.[1] ?? '';
      expect(classAttr).toContain('translate-y-[50px]');
    });

    it('the h2 does NOT have animate-fade-up statically applied (no CSS animation used)', () => {
      // Scroll-scrubbing uses inline styles, not CSS animation class
      const h2Match = templateContent.match(/<h2\s([^>]*)>/);
      const classAttr = h2Match?.[1] ?? '';
      expect(classAttr).not.toContain('animate-fade-up');
    });
  });

  describe('scroll-scrubbing script block', () => {
    it('includes a <script> block in the component', () => {
      expect(templateContent).toMatch(/<script[\s>]/);
    });

    it('the script uses a scroll event listener (not IntersectionObserver)', () => {
      // Scroll-scrubbing is driven by the scroll event
      expect(templateContent).toContain("'scroll'");
    });

    it('the script uses getBoundingClientRect to calculate scroll progress', () => {
      // getBoundingClientRect() measures how far the element is inside the viewport
      expect(templateContent).toContain('getBoundingClientRect');
    });

    it('the script applies inline opacity via el.style.opacity', () => {
      // Animation applied directly as inline style, not via class toggling
      expect(templateContent).toContain('style.opacity');
    });

    it('the script applies inline transform via el.style.transform', () => {
      // translateY applied directly as inline style for cross-browser scrubbing
      expect(templateContent).toContain('style.transform');
    });

    it('the script uses requestAnimationFrame for performance', () => {
      // rAF throttles the scroll handler for smooth 60fps scrubbing
      expect(templateContent).toContain('requestAnimationFrame');
    });

    it('the script does NOT use IntersectionObserver (replaced by scroll scrubbing)', () => {
      // Old one-shot approach removed; scroll event drives the effect now
      expect(templateContent).not.toContain('IntersectionObserver');
    });

    it('the script does NOT add animate-fade-up class at runtime', () => {
      // No CSS animation class; inline styles are used instead
      expect(templateContent).not.toContain('animate-fade-up');
    });
  });

  describe('existing h2 structure is preserved', () => {
    it('the h2 still uses the large clamp font size class', () => {
      const h2Match = templateContent.match(/<h2\s[^>]*>/);
      expect(h2Match).not.toBeNull();
      expect(h2Match![0]).toContain('clamp');
    });

    it('the h2 still contains the two title span lines', () => {
      // Both span lines with t('about.titleLine1') and t('about.titleLine2') must remain
      expect(templateContent).toContain("t('about.titleLine1')");
      expect(templateContent).toContain("t('about.titleLine2')");
    });
  });

  describe('Story 7 — island integration', () => {
    it('imports AboutScrollGallery from the islands directory', () => {
      // The island must be imported for client:load hydration to work
      expect(templateContent).toContain("from '../islands/AboutScrollGallery'");
    });

    it('mounts AboutScrollGallery with client:load directive', () => {
      // client:load ensures hydration on page load (not defer/idle)
      expect(templateContent).toContain('client:load');
    });

    it('passes items prop to AboutScrollGallery (galleryItems)', () => {
      // The island receives the Sanity-driven gallery items array
      expect(templateContent).toContain('items={galleryItems}');
    });

    it('the AboutScrollGallery island tag is present in the template', () => {
      expect(templateContent).toContain('<AboutScrollGallery');
    });

    it('the existing title scrub script with data-scroll-scrub selector is preserved', () => {
      // Story 6 scroll scrub must not be removed by Story 7 changes
      expect(templateContent).toContain('data-scroll-scrub');
    });

    it('constrains the gallery wrapper width on desktop so the island can overflow horizontally', () => {
      const wrapperMatch = templateContent.match(/<div class="about-gallery-wrapper[^"]*"/);
      expect(wrapperMatch).not.toBeNull();
      expect(wrapperMatch![0]).toContain('w-full');
      expect(wrapperMatch![0]).toContain('min-w-0');
      expect(wrapperMatch![0]).toContain('lg:flex-1');
    });

    it('clips the gallery wrapper instead of letting the desktop track size the flex column', () => {
      const wrapperMatch = templateContent.match(/<div class="about-gallery-wrapper[^"]*"/);
      expect(wrapperMatch).not.toBeNull();
      expect(wrapperMatch![0]).toContain('overflow-hidden');
      expect(wrapperMatch![0]).not.toContain('flex-shrink-0');
    });
  });

  describe('subtitle div hover color inversion', () => {
    it('the subtitle div starts with a white background', () => {
      // The default state must show bg-white so the hover inversion is visible
      expect(templateContent).toMatch(/\bbg-white\b/);
    });

    it('the subtitle div inverts to a black background on hover', () => {
      // hover:bg-black on the subtitle element
      expect(templateContent).toMatch(/\bhover:bg-black\b/);
    });

    it('the subtitle div text starts as black', () => {
      // Default text color: text-black
      expect(templateContent).toMatch(/\btext-black\b/);
    });

    it('the subtitle div text inverts to white on hover', () => {
      // hover:text-white on the subtitle element
      expect(templateContent).toMatch(/\bhover:text-white\b/);
    });

    it('the subtitle div has a smooth transition for the color inversion', () => {
      // Must include transition-colors or transition for smooth visual change
      expect(templateContent).toMatch(/\btransition(?:-colors|-all)?\b/);
    });

    it('the subtitle div inversion has both hover:bg-black and hover:text-white simultaneously', () => {
      // Both sides of the inversion must be declared for a complete visual swap
      expect(templateContent).toMatch(/\bhover:bg-black\b/);
      expect(templateContent).toMatch(/\bhover:text-white\b/);
    });
  });
});
