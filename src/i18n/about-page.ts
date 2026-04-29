import { type Locales } from './locales';

export interface AboutPageContent {
  'aboutPage.heroTitle': string;
}

export const aboutPage: Record<Locales, AboutPageContent> = {
  es: {
    'aboutPage.heroTitle': 'Sobre Nosotros',
  },
  en: {
    'aboutPage.heroTitle': 'About Us',
  },
  it: {
    'aboutPage.heroTitle': 'Chi Siamo',
  },
  pt: {
    'aboutPage.heroTitle': 'Sobre Nós',
  },
  de: {
    'aboutPage.heroTitle': 'Über Uns',
  },
  zh: {
    'aboutPage.heroTitle': '关于我们',
  },
};
