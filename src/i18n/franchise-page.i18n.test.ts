import { describe, expect, it } from 'vitest';

import { franchisePage, type FranchisePageContent } from './franchise-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const franchisePageKeys = [
  'franchisePage.hero.eyebrow',
  'franchisePage.hero.title',
  'franchisePage.hero.subtitle',
  'franchisePage.why.title',
  'franchisePage.why.paragraph1',
  'franchisePage.why.paragraph2',
  'franchisePage.why.paragraph3',
  'franchisePage.types.title',
  'franchisePage.types.master.label',
  'franchisePage.types.master.description',
  'franchisePage.types.design.label',
  'franchisePage.types.design.description',
  'franchisePage.map.title',
  'franchisePage.map.description',
  'franchisePage.expansion.title',
  'franchisePage.expansion.regionAmerica',
  'franchisePage.expansion.regionEurope',
  'franchisePage.expansion.regionAsia',
  'franchisePage.expansion.america1',
  'franchisePage.expansion.america2',
  'franchisePage.expansion.america3',
  'franchisePage.expansion.america4',
  'franchisePage.expansion.america5',
  'franchisePage.expansion.america6',
  'franchisePage.expansion.america7',
  'franchisePage.expansion.america8',
  'franchisePage.expansion.america9',
  'franchisePage.expansion.america10',
  'franchisePage.expansion.america11',
  'franchisePage.expansion.europe1',
  'franchisePage.expansion.europe2',
  'franchisePage.expansion.europe3',
  'franchisePage.expansion.europe4',
  'franchisePage.expansion.europe5',
  'franchisePage.expansion.europe6',
  'franchisePage.expansion.europe7',
  'franchisePage.expansion.asia1',
  'franchisePage.expansion.asia2',
  'franchisePage.expansion.asia3',
  'franchisePage.expansion.asia4',
  'franchisePage.expansion.asia5',
  'franchisePage.expansion.asia6',
  'franchisePage.stats.countryLabel',
  'franchisePage.stats.pointCount',
  'franchisePage.stats.pointLabel',
  'franchisePage.stats.comingSoon',
  'franchisePage.stats.description',
  'franchisePage.form.title',
  'franchisePage.form.fieldName',
  'franchisePage.form.fieldEmail',
  'franchisePage.form.fieldPhone',
  'franchisePage.form.fieldCity',
  'franchisePage.form.fieldCountry',
  'franchisePage.form.submit',
  'franchisePage.success.title',
  'franchisePage.success.paragraph1',
  'franchisePage.success.paragraph2',
  'franchisePage.success.cta',
  'franchisePage.next.title',
  'franchisePage.next.step1.title',
  'franchisePage.next.step1.description',
  'franchisePage.next.step2.title',
  'franchisePage.next.step2.description',
  'franchisePage.next.step3.title',
  'franchisePage.next.step3.description',
  'franchisePage.next.step4.title',
  'franchisePage.next.step4.description',
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

  it('keeps the Spanish UI copy aligned with the current franchise page', () => {
    expect(franchisePage.es['franchisePage.why.title']).toBe('¿POR QUÉ ELEGIR A C I U M?');
    expect(franchisePage.es['franchisePage.types.title']).toBe('TIPO DE FRANQUICIADO');
    expect(franchisePage.es['franchisePage.expansion.regionAmerica']).toBe('América');
    expect(franchisePage.es['franchisePage.form.fieldCountry']).toBe('PAÍS*');
    expect(franchisePage.es['franchisePage.success.paragraph1']).toBe('Gracias por tu interés en formar parte de A C I U M');
    expect(franchisePage.es['franchisePage.success.cta']).toBe('HABLAR CON UN ASESOR');
    expect(franchisePage.es['franchisePage.next.title']).toBe('¿QUÉ SIGUE?');
  });

  it('provides localized titles for the next-steps section', () => {
    const expectedTitles: Record<(typeof locales)[number], string> = {
      es: '¿QUÉ SIGUE?',
      en: 'WHAT COMES NEXT?',
      it: 'COSA SUCCEDE ORA?',
      pt: 'O QUE VEM AGORA?',
      de: 'WAS KOMMT ALS NÄCHSTES?',
      zh: '接下来是什么？',
    };

    for (const locale of locales) {
      expect(franchisePage[locale]['franchisePage.next.title']).toBe(expectedTitles[locale]);
    }
  });
});
