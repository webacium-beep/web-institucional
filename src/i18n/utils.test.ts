import { describe, expect, it } from 'vitest';

import { normalizeLocale, useTranslations } from './utils';

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
