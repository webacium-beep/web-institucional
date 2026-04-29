import { describe, expect, it } from 'vitest';

import { normalizeLocale, useTranslations, usePageTranslations } from './utils';
import { aboutPage } from './about-page';

describe('normalizeLocale', () => {
  it('returns the same locale when it is supported', () => {
    expect(normalizeLocale('en')).toBe('en');
  });

  it('falls back to es when locale is missing', () => {
    expect(normalizeLocale(undefined)).toBe('es');
  });

  it('falls back to es when locale is unsupported', () => {
    expect(normalizeLocale('fr')).toBe('es');
  });
});

describe('useTranslations', () => {
  it('returns locale-specific translations when locale is valid', () => {
    const t = useTranslations('en');

    expect(t('nav.about')).toBe('ABOUT US');
  });

  it('falls back to es translations when locale is invalid', () => {
    const t = useTranslations('fr');

    expect(t('nav.about')).toBe('SOBRE NOSOTROS');
  });
});

describe('usePageTranslations', () => {
  it('returns correct translation for valid locale', () => {
    const t = usePageTranslations('en', aboutPage);

    expect(t('aboutPage.heroTitle')).toBe('About Us');
    expect(t('aboutPage.integratedModel.title')).toBe('Integrated model');
  });

  it('returns correct translation for Spanish locale', () => {
    const t = usePageTranslations('es', aboutPage);

    expect(t('aboutPage.heroTitle')).toBe('Sobre Nosotros');
    expect(t('aboutPage.finalCta.label')).toBe('Descubre nuestros lanzamientos');
  });

  it('falls back to Spanish for null locale', () => {
    const t = usePageTranslations(null, aboutPage);

    expect(t('aboutPage.heroTitle')).toBe('Sobre Nosotros');
  });

  it('falls back to Spanish for undefined locale', () => {
    const t = usePageTranslations(undefined, aboutPage);

    expect(t('aboutPage.heroTitle')).toBe('Sobre Nosotros');
  });

  it('falls back to Spanish for unsupported locale', () => {
    const t = usePageTranslations('fr' as any, aboutPage);

    expect(t('aboutPage.heroTitle')).toBe('Sobre Nosotros');
  });

  it('returns correct translation for all supported locales', () => {
    const translations: Record<string, string> = {
      es: 'Sobre Nosotros',
      en: 'About Us',
      it: 'Chi Siamo',
      pt: 'Sobre Nós',
      de: 'Über Uns',
      zh: '关于我们',
    };

    for (const [locale, expected] of Object.entries(translations)) {
      const t = usePageTranslations(locale, aboutPage);
      expect(t('aboutPage.heroTitle')).toBe(expected);
    }
  });
});
