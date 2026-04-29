/**
 * Tests for HomePage.astro template
 *
 * Verifies:
 * 1. HomePage imports PageLayout (not Layout).
 * 2. HomePage does NOT import FooterSection (footer owned by PageLayout).
 * 3. HomePage declares Props interface with lang: Locales.
 * 4. HomePage renders <PageLayout lang={lang}> wrapping all sections.
 * 5. All section order is preserved: Banner → AboutSection → ... → NewsroomSection.
 *
 * Strategy: Static template content inspection.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'HomePage.astro');

describe('HomePage.astro — template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  describe('imports — PageLayout only', () => {
    it('imports PageLayout from layouts/PageLayout.astro', () => {
      expect(templateContent).toMatch(
        /import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/
      );
    });

    it('does NOT import Layout from layouts/Layout.astro', () => {
      expect(templateContent).not.toMatch(
        /import\s+Layout\s+from\s+["']\.\.\/\.\.\/layouts\/Layout\.astro["']/
      );
    });

    it('does NOT import FooterSection directly', () => {
      expect(templateContent).not.toMatch(
        /import\s+FooterSection\s+from\s+["']\.\.\/organisms\/FooterSection\.astro["']/
      );
    });
  });

  describe('prop interface', () => {
    it('imports Locales type from i18n/ui', () => {
      expect(templateContent).toMatch(
        /import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/
      );
    });

    it('declares Props interface with lang: Locales', () => {
      expect(templateContent).toMatch(/lang:\s*Locales/);
    });

    it('destructures lang from Astro.props', () => {
      expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    });
  });

  describe('PageLayout wrapper', () => {
    it('renders <PageLayout lang={lang}> wrapping slot content', () => {
      // The open tag and close tag must both be present with lang prop
      expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}/);
      expect(templateContent).toMatch(/<\/PageLayout>/);
    });

    it('does NOT render <Layout> wrapper', () => {
      expect(templateContent).not.toMatch(/<Layout>/);
      expect(templateContent).not.toMatch(/<\/Layout>/);
    });

    it('does NOT render <FooterSection /> manually', () => {
      expect(templateContent).not.toMatch(/<FooterSection\s/);
    });
  });

  describe('section order preservation', () => {
    const sections = [
      'Banner',
      'AboutSection',
      'EngravingSection',
      'FeaturedLaunch',
      'SectionDivider',
      'FeaturedWorld',
      'WorldFormatsGallerySection',
      'FranchiseSection',
      'NewsroomSection',
    ];

    it('renders all sections in order inside PageLayout', () => {
      // Verify each section appears and capture their positions
      const positions = sections.map((section) => {
        const match = templateContent.match(new RegExp(`<${section}\\s`));
        return match ? templateContent.indexOf(match[0]) : -1;
      });

      // All sections must be present
      positions.forEach((pos, i) => {
        expect(pos).toBeGreaterThan(-1);
      });

      // Verify correct order (each position must be greater than the previous)
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i]).toBeGreaterThan(positions[i - 1]);
      }
    });

    it('sections are rendered inside PageLayout slot (after open, before close)', () => {
      const openIndex = templateContent.indexOf('<PageLayout');
      const closeIndex = templateContent.indexOf('</PageLayout>');

      // Every section should be between open and close tags
      sections.forEach((section) => {
        const match = templateContent.match(new RegExp(`<${section}\\s`));
        if (match) {
          const sectionIndex = templateContent.indexOf(match[0]);
          expect(sectionIndex).toBeGreaterThan(openIndex);
          expect(sectionIndex).toBeLessThan(closeIndex);
        }
      });
    });
  });
});