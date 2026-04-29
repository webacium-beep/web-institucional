// src/i18n/utils.ts
import { ui, type Locales } from './ui';
import { SUPPORTED_LOCALES } from './locales';

export function normalizeLocale(lang: string | undefined | null): Locales {
  if (!lang) return 'es';

  return SUPPORTED_LOCALES.includes(lang as Locales) ? (lang as Locales) : 'es';
}

export function useTranslations(lang: string | undefined | null) {
  const safeLang = normalizeLocale(lang);

  return function t(key: keyof typeof ui['es']) {
    return ui[safeLang][key] ?? ui['es'][key];
  }
}

export function usePageTranslations<T>(
  lang: string | null | undefined,
  dictionary: Record<Locales, T>,
) {
  const safeLang = normalizeLocale(lang);

  return function t<K extends keyof T>(key: K): string {
    const value = dictionary[safeLang]?.[key];
    return (value as string) ?? (dictionary['es'][key] as string);
  }
}
