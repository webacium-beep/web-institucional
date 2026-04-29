import { describe, expect, it } from 'vitest';

import { worldPage, type WorldPageContent } from './world-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const worldPageKeys = [
  'worldPage.title',
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

  it('provides localized titles for all supported locales', () => {
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
});
