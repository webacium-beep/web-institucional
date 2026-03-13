// src/i18n/utils.ts
import { ui } from './ui';

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui['es']) {
    return ui[lang][key] || ui['es'][key]; // Retorna español si falta la traducción
  }
}