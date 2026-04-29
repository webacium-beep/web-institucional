/**
 * Tests for AboutPage.astro template
 *
 * Verifies:
 * 1. AboutPage imports and uses PageLayout.
 * 2. AboutPage accepts lang: Locales prop.
 * 3. AboutPage resolves content through the page-owned aboutPage dictionary.
 * 4. AboutPage renders the expected semantic section structure for the textual content.
 *
 * Strategy: Static template content inspection.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'AboutPage.astro');

describe('AboutPage.astro - template composition', () => {
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

  describe('page-owned i18n content', () => {
    it('creates a page-scoped translator using lang and aboutPage dictionary', () => {
      expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*aboutPage\)/);
    });

    it('defines the DNA cards from aboutPage namespace keys', () => {
      expect(templateContent).toContain("title: 'aboutPage.dna.values.eternity.title'");
      expect(templateContent).toContain("title: 'aboutPage.dna.values.emotion.title'");
      expect(templateContent).toContain("title: 'aboutPage.dna.values.versatility.title'");
    });

    it('defines the integrated model features from aboutPage namespace keys', () => {
      expect(templateContent).toContain("'aboutPage.integratedModel.features.product'");
      expect(templateContent).toContain("'aboutPage.integratedModel.features.pointOfSale'");
      expect(templateContent).toContain("'aboutPage.integratedModel.features.portfolio'");
      expect(templateContent).toContain("'aboutPage.integratedModel.features.retail'");
    });

    it('does not use Home or shared about namespaces', () => {
      expect(templateContent).not.toContain("t('about.title");
      expect(templateContent).not.toContain("t('about.badge");
      expect(templateContent).not.toContain("t('home.");
    });
  });

  describe('semantic textual structure', () => {
    it('wraps the content in PageLayout and article', () => {
      expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
    });

    it('renders the top label/title section from aboutPage.heroTitle', () => {
      expect(templateContent).toContain("{t('aboutPage.heroTitle')}");
      expect(templateContent).toContain('<header class=');
    });

    it('renders semantic sections for hero, DNA, legacy, integrated model, and final CTA', () => {
      expect(templateContent).toContain('aria-labelledby="about-hero-title"');
      expect(templateContent).toContain('aria-labelledby="about-dna-title"');
      expect(templateContent).toContain('aria-labelledby="about-legacy-title"');
      expect(templateContent).toContain('aria-labelledby="about-integrated-model-title"');
      expect(templateContent).toContain('aria-labelledby="about-final-cta-title"');
    });

    it('uses the expected hero and legacy translation keys in semantic headings and copy', () => {
      expect(templateContent).toContain("{t('aboutPage.hero.eyebrow')}");
      expect(templateContent).toContain("{t('aboutPage.hero.title')}");
      expect(templateContent).toContain("{t('aboutPage.hero.description')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.title')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.eyebrow')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.paragraph1')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.paragraph2')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.paragraph3')}");
    });

    it('uses the expected integrated model and final CTA keys', () => {
      expect(templateContent).toContain("{t('aboutPage.integratedModel.title')}");
      expect(templateContent).toContain("{t('aboutPage.integratedModel.description')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.titleLine1')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.titleLine2')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.label')}");
    });
  });
});
