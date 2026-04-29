/**
 * Tests for AboutPage.astro template
 *
 * Verifies:
 * 1. AboutPage imports and uses PageLayout.
 * 2. AboutPage accepts lang: Locales prop.
 * 3. AboutPage renders a hardcoded <h1>About Us</h1> inside PageLayout slot.
 * 4. AboutPage does NOT use i18n for the heading text (hardcoded English).
 *
 * Strategy: Static template content inspection.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'AboutPage.astro');

describe('AboutPage.astro — template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  describe('imports and prop interface', () => {
    it('imports PageLayout from layouts/PageLayout.astro', () => {
      expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    });

    it('imports Locales type from i18n/ui', () => {
      expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    });

    it('declares Props interface with lang: Locales', () => {
      expect(templateContent).toMatch(/lang:\s*Locales/);
    });

    it('destructures lang from Astro.props', () => {
      expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    });
  });

  describe('PageLayout usage', () => {
    it('renders <PageLayout lang={lang}> wrapping slot content', () => {
      expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<h1>About Us<\/h1>[\s\S]*<\/PageLayout>/);
    });
  });

  describe('placeholder content', () => {
    it('renders <h1>About Us</h1> as hardcoded text (not i18n)', () => {
      expect(templateContent).toContain('<h1>About Us</h1>');
    });

    it('does NOT use t() or i18n key for the heading', () => {
      expect(templateContent).not.toContain("t('about");
      expect(templateContent).not.toContain('about.title');
    });
  });
});