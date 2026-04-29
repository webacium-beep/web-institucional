import { type Locales } from './locales';

export interface WorldPageContent {
  'worldPage.title': string;
}

export const worldPage: Record<Locales, WorldPageContent> = {
  es: {
    'worldPage.title': 'Alrededor del Mundo',
  },
  en: {
    'worldPage.title': 'Around the World',
  },
  it: {
    'worldPage.title': 'Nel Mondo',
  },
  pt: {
    'worldPage.title': 'Ao Redor do Mundo',
  },
  de: {
    'worldPage.title': 'Rund um die Welt',
  },
  zh: {
    'worldPage.title': '遍布全球',
  },
};
