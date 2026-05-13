import { describe, expect, it } from 'vitest';

import { engravingPage, type EngravingPageContent } from './engraving-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const engravingPageKeys = [
  'engravingPage.hero.title',
  'engravingPage.hero.description',
  'engravingPage.icons.precision.title',
  'engravingPage.icons.precision.description',
  'engravingPage.icons.technology.title',
  'engravingPage.icons.technology.description',
  'engravingPage.icons.meaning.title',
  'engravingPage.icons.meaning.description',
  'engravingPage.icons.materials.title',
  'engravingPage.icons.materials.description',
  'engravingPage.story.title',
  'engravingPage.story.description',
  'engravingPage.experience.title',
  'engravingPage.experience.description',
] as const satisfies readonly (keyof EngravingPageContent)[];

describe('engraving-page i18n dictionary', () => {
  it('exports an EngravingPageContent shape with the full engravingPage namespace', () => {
    const content: EngravingPageContent = engravingPage.es;
    expect(Object.keys(content)).toHaveLength(engravingPageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...engravingPageKeys].sort());
  });

  it('defines all six locales in engravingPage record', () => {
    for (const locale of locales) {
      expect(engravingPage).toHaveProperty(locale);
    }
  });

  it('defines every expected engravingPage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(engravingPage[locale]).sort()).toEqual([...engravingPageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of engravingPageKeys) {
        expect(engravingPage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish copy aligned with the approved design text', () => {
    expect(engravingPage.es['engravingPage.hero.title']).toBe('MOMENTOS ETERNIZADOS EN JOYAS');
    expect(engravingPage.es['engravingPage.icons.precision.title']).toBe('Grabado de precisión');
    expect(engravingPage.es['engravingPage.icons.materials.description']).toBe('Acero 316L diseñado para acompañar cada momento.');
    expect(engravingPage.es['engravingPage.story.title']).toBe('El fotograbado es el corazón de A C I U M');
    expect(engravingPage.es['engravingPage.experience.title']).toBe('Una experiencia creada para ser recordada.');
  });
});
