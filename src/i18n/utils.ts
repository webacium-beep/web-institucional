// src/i18n/utils.ts
import { ui, type Locales } from './ui';

export function normalizeLocale(lang: string | undefined | null): Locales {
  if (!lang) return 'es';

  return lang in ui ? (lang as Locales) : 'es';
}

export function useTranslations(lang: string | undefined | null) {
  const safeLang = normalizeLocale(lang);

  return function t(key: keyof typeof ui['es']) {
    return ui[safeLang][key] ?? ui['es'][key];
  }
}
