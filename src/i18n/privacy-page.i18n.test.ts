import { describe, expect, it } from 'vitest';

import { privacyPage, type PrivacyPageContent } from './privacy-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const privacyPageKeys = [
  'privacyPage.title',
  'privacyPage.intro.title',
  'privacyPage.intro.description',
  'privacyPage.collection.title',
  'privacyPage.collection.intro',
  'privacyPage.collection.item1',
  'privacyPage.collection.item2',
  'privacyPage.collection.item3',
  'privacyPage.collection.item4',
  'privacyPage.collection.item5',
  'privacyPage.usage.title',
  'privacyPage.usage.description',
  'privacyPage.usage.item1',
  'privacyPage.usage.item2',
  'privacyPage.usage.item3',
  'privacyPage.consent.title',
  'privacyPage.consent.description',
  'privacyPage.legalBasis.title',
  'privacyPage.legalBasis.intro',
  'privacyPage.legalBasis.item1',
  'privacyPage.legalBasis.item2',
  'privacyPage.legalBasis.item3',
  'privacyPage.dataSharing.title',
  'privacyPage.dataSharing.description',
  'privacyPage.transfer.title',
  'privacyPage.transfer.description',
  'privacyPage.retention.title',
  'privacyPage.retention.description',
  'privacyPage.rights.title',
  'privacyPage.rights.intro',
  'privacyPage.rights.item1',
  'privacyPage.rights.item2',
  'privacyPage.rights.item3',
  'privacyPage.rights.item4',
  'privacyPage.protection.title',
  'privacyPage.protection.description',
  'privacyPage.contact.title',
  'privacyPage.contact.description',
  'privacyPage.contact.email',
] as const satisfies readonly (keyof PrivacyPageContent)[];

describe('privacy-page i18n dictionary', () => {
  it('exports a PrivacyPageContent shape with the full privacy page namespace', () => {
    const content: PrivacyPageContent = privacyPage.es;

    expect(Object.keys(content)).toHaveLength(privacyPageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...privacyPageKeys].sort());
  });

  it('defines all six locales in privacyPage record', () => {
    for (const locale of locales) {
      expect(privacyPage).toHaveProperty(locale);
    }
  });

  it('defines every expected privacyPage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(privacyPage[locale]).sort()).toEqual([...privacyPageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of privacyPageKeys) {
        expect(privacyPage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish source copy aligned with the expanded legal structure', () => {
    expect(privacyPage.es['privacyPage.title']).toBe('POLITICAS DE PRIVACIDAD');
    expect(privacyPage.es['privacyPage.intro.title']).toBe('Uso de datos en formularios');
    expect(privacyPage.es['privacyPage.collection.title']).toBe('¿QUE INFORMACION RECOPILAMOS?');
    expect(privacyPage.es['privacyPage.collection.intro']).toBe('Dependiendo del tipo de formulario, podemos recopilar:');
    expect(privacyPage.es['privacyPage.usage.item1']).toBe('Responder solicitudes de contacto');
    expect(privacyPage.es['privacyPage.usage.item2']).toBe('Gestionar aplicaciones de franquicia');
    expect(privacyPage.es['privacyPage.usage.item3']).toBe('Mejorar nuestros servicios y experiencia digital');
    expect(privacyPage.es['privacyPage.consent.title']).toBe('Consentimiento del usuario');
    expect(privacyPage.es['privacyPage.transfer.title']).toBe('Transferencia de datos');
    expect(privacyPage.es['privacyPage.retention.title']).toBe('¿Cuanto tiempo conservamos tus datos?');
    expect(privacyPage.es['privacyPage.protection.title']).toBe('Proteccion de la informacion');
    expect(privacyPage.es['privacyPage.contact.email']).toBe('ACIUMMILANO@ACIUM.GROUP');
  });

  it('provides localized page titles for all supported locales', () => {
    const expectedTitles: Record<(typeof locales)[number], string> = {
      es: 'POLITICAS DE PRIVACIDAD',
      en: 'PRIVACY POLICY',
      it: 'POLITICA SULLA PRIVACY',
      pt: 'POLITICA DE PRIVACIDADE',
      de: 'DATENSCHUTZRICHTLINIE',
      zh: '隐私政策',
    };

    for (const locale of locales) {
      expect(privacyPage[locale]['privacyPage.title']).toBe(expectedTitles[locale]);
    }
  });
});
