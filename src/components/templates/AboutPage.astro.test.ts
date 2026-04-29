/**
 * Tests for AboutPage.astro template
 *
 * Verifies:
 * 1. AboutPage imports and uses PageLayout.
 * 2. AboutPage accepts lang: Locales prop.
 * 3. AboutPage imports and uses the page-owned aboutPage dictionary.
 * 4. AboutPage resolves its heading through usePageTranslations and the aboutPage.heroTitle key.
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

    it('imports the aboutPage dictionary from i18n/about-page', () => {
      expect(templateContent).toMatch(/import\s+\{\s*aboutPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/about-page["']/);
    });

    it('imports usePageTranslations from i18n/utils', () => {
      expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
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
      expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<h1>\{t\('aboutPage\.heroTitle'\)\}<\/h1>[\s\S]*<\/PageLayout>/);
    });
  });

  describe('page-owned i18n content', () => {
    it('creates a page-scoped translator using lang and aboutPage dictionary', () => {
      expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*aboutPage\)/);
    });

    it('renders the heading through the aboutPage.heroTitle key', () => {
      expect(templateContent).toContain("<h1>{t('aboutPage.heroTitle')}</h1>");
    });

    it('does NOT use the old hardcoded About Us placeholder', () => {
      expect(templateContent).not.toContain('<h1>About Us</h1>');
    });

    it('does NOT use the Home about.* namespace for the About page heading', () => {
      expect(templateContent).not.toContain("t('about.title");
      expect(templateContent).not.toContain("t('about.badge");
    });
  });
});
