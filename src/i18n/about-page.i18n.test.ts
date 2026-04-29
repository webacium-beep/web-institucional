import { describe, expect, it } from 'vitest';

import { aboutPage, type AboutPageContent } from './about-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const aboutPageKeys = [
  'aboutPage.heroTitle',
  'aboutPage.hero.title',
  'aboutPage.hero.eyebrow',
  'aboutPage.hero.description',
  'aboutPage.dna.title',
  'aboutPage.dna.values.eternity.title',
  'aboutPage.dna.values.eternity.description',
  'aboutPage.dna.values.emotion.title',
  'aboutPage.dna.values.emotion.description',
  'aboutPage.dna.values.versatility.title',
  'aboutPage.dna.values.versatility.description',
  'aboutPage.legacy.title',
  'aboutPage.legacy.eyebrow',
  'aboutPage.legacy.paragraph1',
  'aboutPage.legacy.paragraph2',
  'aboutPage.legacy.paragraph3',
  'aboutPage.integratedModel.title',
  'aboutPage.integratedModel.description',
  'aboutPage.integratedModel.features.product',
  'aboutPage.integratedModel.features.pointOfSale',
  'aboutPage.integratedModel.features.portfolio',
  'aboutPage.integratedModel.features.retail',
  'aboutPage.finalCta.titleLine1',
  'aboutPage.finalCta.titleLine2',
  'aboutPage.finalCta.label',
] as const satisfies readonly (keyof AboutPageContent)[];

describe('about-page i18n dictionary', () => {
  it('exports an AboutPageContent shape with the full About page namespace', () => {
    const content: AboutPageContent = aboutPage.es;

    expect(Object.keys(content)).toHaveLength(aboutPageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...aboutPageKeys].sort());
  });

  it('defines all six locales in aboutPage record', () => {
    for (const locale of locales) {
      expect(aboutPage).toHaveProperty(locale);
    }
  });

  it('defines every expected aboutPage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(aboutPage[locale]).sort()).toEqual([...aboutPageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of aboutPageKeys) {
        expect(aboutPage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish source copy aligned with the screenshot structure', () => {
    expect(aboutPage.es['aboutPage.heroTitle']).toBe('Sobre Nosotros');
    expect(aboutPage.es['aboutPage.hero.title']).toBe('Momentos que se convierten en joyas');
    expect(aboutPage.es['aboutPage.hero.eyebrow']).toBe('Un modelo que se convierte en crecimiento');
    expect(aboutPage.es['aboutPage.dna.title']).toBe('Nuestro ADN');
    expect(aboutPage.es['aboutPage.legacy.eyebrow']).toBe('No vendemos joyas. Creamos significado.');
    expect(aboutPage.es['aboutPage.integratedModel.description']).toBe('Diseñado para emocionar. Construido para escalar.');
    expect(aboutPage.es['aboutPage.finalCta.label']).toBe('Descubre nuestros lanzamientos');
  });

  it('provides localized hero titles for all supported locales', () => {
    const expectedHeroTitles: Record<(typeof locales)[number], string> = {
      es: 'Sobre Nosotros',
      en: 'About Us',
      it: 'Chi Siamo',
      pt: 'Sobre Nós',
      de: 'Über Uns',
      zh: '关于我们',
    };

    for (const locale of locales) {
      expect(aboutPage[locale]['aboutPage.heroTitle']).toBe(expectedHeroTitles[locale]);
    }
  });

  it('provides localized final CTA labels for all supported locales', () => {
    const expectedCtaLabels: Record<(typeof locales)[number], string> = {
      es: 'Descubre nuestros lanzamientos',
      en: 'Discover our launches',
      it: 'Scopri i nostri lanci',
      pt: 'Descubra nossos lançamentos',
      de: 'Entdecke unsere Neuheiten',
      zh: '探索我们的新品发布',
    };

    for (const locale of locales) {
      expect(aboutPage[locale]['aboutPage.finalCta.label']).toBe(expectedCtaLabels[locale]);
    }
  });
});
