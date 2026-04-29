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

    it('imports the kiosk hero asset for the first About section', () => {
      expect(templateContent).toMatch(/import\s+kioskoAboutUsSectionOne\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/kioskoaboutussectionone\.svg["']/);
    });

    it('imports the three DNA card assets', () => {
      expect(templateContent).toMatch(/import\s+imagenEternidad\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/imagenEternidad\.svg["']/);
      expect(templateContent).toMatch(/import\s+imagenEmocion\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/imagenemocion\.svg["']/);
      expect(templateContent).toMatch(/import\s+imagenNuestroLegado\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/imagennuestrolegado\.svg["']/);
      expect(templateContent).toMatch(/import\s+imagenVersatilidad\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/imagenversatilidad\.svg["']/);
    });

    it('imports the four integrated model icons', () => {
      expect(templateContent).toMatch(/import\s+iconExperiencia\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/iconexpperiencia\.svg["']/);
      expect(templateContent).toMatch(/import\s+iconPortafolio\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/iconPortafolio\.svg["']/);
      expect(templateContent).toMatch(/import\s+iconProducto\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/iconProducto\.svg["']/);
      expect(templateContent).toMatch(/import\s+iconSistema\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/iconSistema\.svg["']/);
    });

    it('imports the final CTA visual assets', () => {
      expect(templateContent).toMatch(/import\s+imagenesDeLosDosDijes\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/imagenesdelosdosdijes\.svg["']/);
      expect(templateContent).toMatch(/import\s+kioskoSeccionFinal\s+from\s+["']\.\.\/\.\.\/assets\/aboutuspage\/kioskoseccionfinal\.svg["']/);
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
      expect(templateContent).toMatch(/const\s+heroDescription\s*=\s*t\('aboutPage\.hero\.description'\)/);
    });

    it('defines the DNA cards from aboutPage namespace keys', () => {
      expect(templateContent).toContain('imageSrc: imagenEternidadSrc');
      expect(templateContent).toContain("imageAlt: 'Joya ACIUM Eternidad'");
      expect(templateContent).toContain('imageSrc: imagenEmocionSrc');
      expect(templateContent).toContain("imageAlt: 'Joya ACIUM Emoción'");
      expect(templateContent).toContain('imageSrc: imagenVersatilidadSrc');
      expect(templateContent).toContain("imageAlt: 'Joya ACIUM Versatilidad'");
      expect(templateContent).toContain("title: 'aboutPage.dna.values.eternity.title'");
      expect(templateContent).toContain("title: 'aboutPage.dna.values.emotion.title'");
      expect(templateContent).toContain("title: 'aboutPage.dna.values.versatility.title'");
    });

    it('defines the integrated model features from aboutPage namespace keys', () => {
      expect(templateContent).toContain("label: 'aboutPage.integratedModel.features.product'");
      expect(templateContent).toContain("label: 'aboutPage.integratedModel.features.pointOfSale'");
      expect(templateContent).toContain("label: 'aboutPage.integratedModel.features.portfolio'");
      expect(templateContent).toContain("label: 'aboutPage.integratedModel.features.retail'");
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
      expect(templateContent).toContain('text-[30px] font-black');
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
      expect(templateContent).toContain("const heroDescription = t('aboutPage.hero.description')");
      expect(templateContent).toContain("{t('aboutPage.dna.title')}");
      expect(templateContent).toContain("{t('aboutPage.dna.titleLine1')}");
      expect(templateContent).toContain("{t('aboutPage.dna.titleLine2')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.title')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.eyebrow')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.paragraph1')}");
      expect(templateContent).toContain("{t('aboutPage.legacy.paragraph2')}");
      expect(templateContent).toContain("const legacyParagraph3 = t('aboutPage.legacy.paragraph3')");
    });

    it('renders the first hero section with the real kiosk image and fixed CTA dimensions', () => {
      expect(templateContent).toContain('alt="ACIUM display kiosk"');
      expect(templateContent).toContain('h-[45px]');
      expect(templateContent).toContain('w-auto');
      expect(templateContent).toContain('cursor-pointer');
      expect(templateContent).toContain('text-[16px]');
      expect(templateContent).toContain('font-medium');
      expect(templateContent).toContain('hover:bg-black');
      expect(templateContent).toContain('hover:text-white');
      expect(templateContent).toContain('text-[18px] font-light leading-[1.55]');
    });

    it('highlights the ACIUM word inside the hero copy with its own span', () => {
      expect(templateContent).toContain("heroDescription.split('ACIUM')");
      expect(templateContent).toContain('>A C I U M</span>');
      expect(templateContent).toContain('text-[18px]');
      expect(templateContent).toContain('font-medium');
      expect(templateContent).toContain('tracking-[0.22em]');
    });

    it('renders the DNA section with framed cards and centered supporting copy', () => {
      expect(templateContent).toContain('lg:grid-cols-[minmax(0,220px)_1fr]');
      expect(templateContent).toContain('h-[250px]');
      expect(templateContent).toContain('max-w-[255px]');
      expect(templateContent).toContain('items-center justify-center bg-white px-5 py-5');
      expect(templateContent).toContain('lg:w-[260px]');
      expect(templateContent).toContain('text-center');
      expect(templateContent).toContain('text-[66px]');
      expect(templateContent).toContain('tracking-[0.18em]');
      expect(templateContent).toContain('text-[22px] font-medium');
      expect(templateContent).toContain('text-[18px] font-light leading-[1.35]');
    });

    it('renders the legacy section with decorative lines, real image asset, and highlighted ACIUM brand', () => {
      expect(templateContent).toContain('h-px w-[64px] bg-neutral-300');
      expect(templateContent).toContain('alt="Dije corazón ACIUM con retrato grabado"');
      expect(templateContent).toContain('text-[36px] font-black uppercase');
      expect(templateContent).toContain('h-[30px] w-auto');
      expect(templateContent).toContain('cursor-pointer');
      expect(templateContent).toContain('text-[14px] font-medium');
      expect(templateContent).toContain('hover:bg-black');
      expect(templateContent).toContain('hover:text-white');
      expect(templateContent).toContain('text-[18px] font-light leading-[1.55]');
      expect(templateContent).toContain("legacyParagraph3.split('ACIUM')");
      expect(templateContent).toContain('>A C I U M</span>');
    });

    it('renders the integrated model section with icon/text feature items', () => {
      expect(templateContent).toContain('lg:grid-cols-[minmax(0,260px)_1fr]');
      expect(templateContent).toContain('gap-x-10 gap-y-12');
      expect(templateContent).toContain('text-center');
      expect(templateContent).toContain('mx-auto max-w-[260px] text-center');
      expect(templateContent).toContain('h-[34px] w-[34px]');
      expect(templateContent).toContain('opacity-70');
      expect(templateContent).toContain('text-[18px] font-light leading-[1.35]');
      expect(templateContent).toContain("iconAlt: 'Ícono de producto emocional'");
      expect(templateContent).toContain("iconAlt: 'Ícono de experiencia en punto de venta'");
      expect(templateContent).toContain("iconAlt: 'Ícono de portafolio adaptable'");
      expect(templateContent).toContain("iconAlt: 'Ícono de sistema optimizado para retail'");
      expect(templateContent).toContain('alt={feature.iconAlt}');
    });

    it('uses the expected integrated model and final CTA keys', () => {
      expect(templateContent).toContain("{t('aboutPage.integratedModel.title')}");
      expect(templateContent).toContain("{t('aboutPage.integratedModel.description')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.titleLine1')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.titleLine2')}");
      expect(templateContent).toContain("{t('aboutPage.finalCta.label')}");
    });

    it('renders the final CTA section with overflow hidden, real assets, and interactive button', () => {
      expect(templateContent).toContain('h-[575px] w-screen overflow-x-clip');
      expect(templateContent).toContain('relative h-full overflow-visible');
      expect(templateContent).toContain('absolute inset-x-0 bottom-0 h-[458px] w-full bg-neutral-100');
      expect(templateContent).toContain('left-1/2');
      expect(templateContent).toContain('ml-[-50vw]');
      expect(templateContent).toContain('mr-[-50vw]');
      expect(templateContent).toContain('flex h-full items-center justify-center px-6');
      expect(templateContent).toContain('alt="Kiosco ACIUM de la sección final"');
      expect(templateContent).toContain('alt="Dos dijes grabados ACIUM"');
      expect(templateContent).toContain('absolute left-0 top-[-117px] h-[498px] w-[530px]');
      expect(templateContent).toContain('class="h-full w-full object-contain"');
      expect(templateContent).toContain('absolute right-0 top-0 flex h-full items-start justify-end overflow-visible pr-[60px]');
      expect(templateContent).toContain('relative z-10 flex max-w-[520px] flex-col items-center justify-center gap-8 text-center');
      expect(templateContent).toContain('top-[-54px]');
      expect(templateContent).toContain('lg:top-[-92px]');
      expect(templateContent).toContain('h-[45px] w-auto');
      expect(templateContent).toContain('cursor-pointer');
      expect(templateContent).toContain('hover:bg-black');
      expect(templateContent).toContain('hover:text-white');
    });
  });
});
