import { describe, expect, it } from 'vitest';

import { franchisePage, type FranchisePageContent } from './franchise-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const franchisePageKeys = [
  'franchisePage.title',
  'franchisePage.hero.eyebrow',
  'franchisePage.hero.title',
  'franchisePage.hero.description',
  'franchisePage.intro.title',
  'franchisePage.intro.description',
  'franchisePage.benefits.title',
  'franchisePage.benefits.item1',
  'franchisePage.benefits.item2',
  'franchisePage.benefits.item3',
  'franchisePage.requirements.title',
  'franchisePage.requirements.item1',
  'franchisePage.requirements.item2',
  'franchisePage.requirements.item3',
  'franchisePage.support.title',
  'franchisePage.support.description',
  'franchisePage.cta.title',
  'franchisePage.cta.description',
  'franchisePage.cta.button',
] as const satisfies readonly (keyof FranchisePageContent)[];

describe('franchise-page i18n dictionary', () => {
  it('exports a FranchisePageContent shape with the full franchisePage namespace', () => {
    const content: FranchisePageContent = franchisePage.es;

    expect(Object.keys(content)).toHaveLength(franchisePageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...franchisePageKeys].sort());
  });

  it('defines all six locales in franchisePage record', () => {
    for (const locale of locales) {
      expect(franchisePage).toHaveProperty(locale);
    }
  });

  it('defines every expected franchisePage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(franchisePage[locale]).sort()).toEqual([...franchisePageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of franchisePageKeys) {
        expect(franchisePage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish source copy aligned with the standalone page foundation', () => {
    expect(franchisePage.es['franchisePage.title']).toBe('OPORTUNIDADES DE FRANQUICIA');
    expect(franchisePage.es['franchisePage.hero.eyebrow']).toBe('Expande con ACIUM');
    expect(franchisePage.es['franchisePage.benefits.title']).toBe('Beneficios clave');
    expect(franchisePage.es['franchisePage.requirements.title']).toBe('Lo que buscamos');
    expect(franchisePage.es['franchisePage.cta.button']).toBe('INICIAR CONVERSACION');
  });

  it('provides localized page titles for all supported locales', () => {
    const expectedTitles: Record<(typeof locales)[number], string> = {
      es: 'OPORTUNIDADES DE FRANQUICIA',
      en: 'FRANCHISE OPPORTUNITIES',
      it: 'OPPORTUNITA DI FRANCHISING',
      pt: 'OPORTUNIDADES DE FRANQUIA',
      de: 'FRANCHISE-MOGLICHKEITEN',
      zh: '加盟机会',
    };

    for (const locale of locales) {
      expect(franchisePage[locale]['franchisePage.title']).toBe(expectedTitles[locale]);
    }
  });
});
