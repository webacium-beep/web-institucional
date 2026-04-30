import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'WorldPage.astro');

describe('WorldPage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  describe('imports and page-scoped translator', () => {
    it('imports PageLayout from layouts/PageLayout.astro', () => {
      expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    });

    it('imports Locales type from i18n/ui', () => {
      expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    });

    it('imports the worldPage dictionary, translator helper, and world logo asset', () => {
      expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
      expect(templateContent).toMatch(/import\s+\{\s*worldPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/world-page["']/);
      expect(templateContent).toMatch(/import\s+logoAciumWorld\s+from\s+["']\.\.\/\.\.\/assets\/logoaciumworld\.svg["']/);
    });

    it('declares Props interface with lang: Locales and reads Astro.props', () => {
      expect(templateContent).toMatch(/lang:\s*Locales/);
      expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    });

    it('creates a page-scoped translator and derives the semantic content collections from worldPage keys', () => {
      expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*worldPage\)/);
      expect(templateContent).toContain("const countryKeys = [");
      expect(templateContent).toContain("'worldPage.expansion.countries.ireland'");
      expect(templateContent).toContain("'worldPage.expansion.countries.japan'");
      expect(templateContent).toContain("const supportLegendKeys = [");
      expect(templateContent).toContain("'worldPage.supportStructure.legend.headquarters'");
      expect(templateContent).toContain("'worldPage.supportStructure.legend.supportNetwork'");
    });
  });

  describe('semantic page structure and key usage', () => {
    it('wraps the page in PageLayout and article', () => {
      expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
    });

    it('renders the top title header from worldPage.title', () => {
      expect(templateContent).toContain('<header class="flex justify-center text-center">');
      expect(templateContent).toContain("{t('worldPage.title')}");
      expect(templateContent).toContain('text-[30px] font-black');
      expect(templateContent).toContain('max-w-6xl');
      expect(templateContent).not.toContain('ACIUM');
    });

    it('renders semantic sections for hero, global presence, expansion, support structure, and final CTA', () => {
      expect(templateContent).toContain('aria-labelledby="world-hero-title"');
      expect(templateContent).toContain('aria-labelledby="world-global-presence-title"');
      expect(templateContent).toContain('aria-labelledby="world-expansion-title"');
      expect(templateContent).toContain('aria-labelledby="world-support-structure-title"');
      expect(templateContent).toContain('aria-labelledby="world-final-cta-title"');
    });

    it('uses the expected hero and global presence translation keys', () => {
      expect(templateContent).toContain("{t('worldPage.hero.badge')}");
      expect(templateContent).toContain("{t('worldPage.hero.title')}");
      expect(templateContent).toContain("{t('worldPage.hero.paragraph1')}");
      expect(templateContent).toContain("{t('worldPage.hero.paragraph2')}");
      expect(templateContent).toContain("{t('worldPage.globalPresence.title')}");
      expect(templateContent).toContain("{t('worldPage.globalPresence.descriptionLine1')}");
      expect(templateContent).toContain("{t('worldPage.globalPresence.descriptionLine2')}");
      expect(templateContent).toContain("aria-label={t('worldPage.globalPresence.videoLabel')}");
      expect(templateContent).toContain("{t('worldPage.globalPresence.videoLabel')}");
    });

    it('uses the expected expansion, support, and final CTA translation keys', () => {
      expect(templateContent).toContain("{t('worldPage.expansion.title')}");
      expect(templateContent).toContain("{t('worldPage.expansion.subtitle')}");
      expect(templateContent).toContain('{countryKeys.map((countryKey) => (');
      expect(templateContent).toContain('{t(countryKey)}');
      expect(templateContent).toContain("{t('worldPage.supportStructure.title')}");
      expect(templateContent).toContain('{supportLegendKeys.map((legendKey) => (');
      expect(templateContent).toContain('{t(legendKey)}');
      expect(templateContent).toContain("{t('worldPage.finalCta.titleLine1')}");
      expect(templateContent).toContain("{t('worldPage.finalCta.titleLine2')}");
      expect(templateContent).toContain("{t('worldPage.finalCta.label')}");
    });

    it('keeps the page owned by the worldPage namespace only', () => {
      expect(templateContent).not.toContain("t('aboutPage.");
      expect(templateContent).not.toContain("t('home.");
    });
  });
});
