import { describe, expect, it } from 'vitest';

import { worldPage, type WorldPageContent } from './world-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const worldPageKeys = [
  'worldPage.title',
  'worldPage.hero.title',
  'worldPage.hero.badge',
  'worldPage.hero.paragraph1',
  'worldPage.hero.paragraph2',
  'worldPage.globalPresence.title',
  'worldPage.globalPresence.descriptionLine1',
  'worldPage.globalPresence.descriptionLine2',
  'worldPage.globalPresence.videoLabel',
  'worldPage.expansion.title',
  'worldPage.expansion.subtitle',
  'worldPage.expansion.countries.ireland',
  'worldPage.expansion.countries.paraguay',
  'worldPage.expansion.countries.uruguay',
  'worldPage.expansion.countries.chile',
  'worldPage.expansion.countries.france',
  'worldPage.expansion.countries.turkey',
  'worldPage.expansion.countries.dubai',
  'worldPage.expansion.countries.singapore',
  'worldPage.expansion.countries.japan',
  'worldPage.supportStructure.title',
  'worldPage.supportStructure.legend.headquarters',
  'worldPage.supportStructure.legend.showroom',
  'worldPage.supportStructure.legend.supportNetwork',
  'worldPage.finalCta.titleLine1',
  'worldPage.finalCta.titleLine2',
  'worldPage.finalCta.label',
] as const satisfies readonly (keyof WorldPageContent)[];

describe('world-page i18n dictionary', () => {
  it('exports a WorldPageContent shape with the world page namespace', () => {
    const content: WorldPageContent = worldPage.es;

    expect(Object.keys(content)).toHaveLength(worldPageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...worldPageKeys].sort());
  });

  it('defines all six locales in worldPage record', () => {
    for (const locale of locales) {
      expect(worldPage).toHaveProperty(locale);
    }
  });

  it('defines every expected worldPage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(worldPage[locale]).sort()).toEqual([...worldPageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of worldPageKeys) {
        expect(worldPage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish source copy aligned with the intended section structure', () => {
    expect(worldPage.es['worldPage.title']).toBe('Alrededor del Mundo');
    expect(worldPage.es['worldPage.hero.title']).toBe('Una emoción que cruza fronteras.');
    expect(worldPage.es['worldPage.hero.badge']).toBe('Un modelo que crece sin límites');
    expect(worldPage.es['worldPage.globalPresence.title']).toBe('Presencia global');
    expect(worldPage.es['worldPage.globalPresence.videoLabel']).toBe('Video');
    expect(worldPage.es['worldPage.expansion.subtitle']).toBe('Crecimiento impulsado por propósito.');
    expect(worldPage.es['worldPage.supportStructure.title']).toBe('Una estructura que respalda el crecimiento');
    expect(worldPage.es['worldPage.finalCta.label']).toBe('Sé parte de nuestra expansión');
  });

  it('provides localized page titles for all supported locales', () => {
    const expectedTitles: Record<(typeof locales)[number], string> = {
      es: 'Alrededor del Mundo',
      en: 'Around the World',
      it: 'Nel Mondo',
      pt: 'Ao Redor do Mundo',
      de: 'Rund um die Welt',
      zh: '遍布全球',
    };

    for (const locale of locales) {
      expect(worldPage[locale]['worldPage.title']).toBe(expectedTitles[locale]);
    }
  });

  it('provides localized final CTA labels for all supported locales', () => {
    const expectedLabels: Record<(typeof locales)[number], string> = {
      es: 'Sé parte de nuestra expansión',
      en: 'Be part of our expansion',
      it: 'Entra a far parte della nostra espansione',
      pt: 'Faça parte da nossa expansão',
      de: 'Werde Teil unserer Expansion',
      zh: '加入我们的扩张之旅',
    };

    for (const locale of locales) {
      expect(worldPage[locale]['worldPage.finalCta.label']).toBe(expectedLabels[locale]);
    }
  });
});
