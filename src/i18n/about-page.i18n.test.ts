import { describe, expect, it } from 'vitest';
import { aboutPage, type AboutPageContent } from './about-page';

describe('about-page i18n dictionary', () => {
  const expectedTranslations: Record<string, string> = {
    es: 'Sobre Nosotros',
    en: 'About Us',
    it: 'Chi Siamo',
    pt: 'Sobre Nós',
    de: 'Über Uns',
    zh: '关于我们',
  };

  it('exports AboutPageContent interface', () => {
    const content: AboutPageContent = {
      'aboutPage.heroTitle': 'test',
    };
    expect(content['aboutPage.heroTitle']).toBe('test');
  });

  it('defines all six locales in aboutPage record', () => {
    const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;
    for (const locale of locales) {
      expect(aboutPage).toHaveProperty(locale);
    }
  });

  it('has non-empty aboutPage.heroTitle for each locale', () => {
    const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;
    for (const locale of locales) {
      expect(aboutPage[locale]['aboutPage.heroTitle'].length).toBeGreaterThan(0);
    }
  });

  it('has correct Spanish translation for heroTitle', () => {
    expect(aboutPage.es['aboutPage.heroTitle']).toBe('Sobre Nosotros');
  });

  it('has correct English translation for heroTitle', () => {
    expect(aboutPage.en['aboutPage.heroTitle']).toBe('About Us');
  });

  it('has correct Italian translation for heroTitle', () => {
    expect(aboutPage.it['aboutPage.heroTitle']).toBe('Chi Siamo');
  });

  it('has correct Portuguese translation for heroTitle', () => {
    expect(aboutPage.pt['aboutPage.heroTitle']).toBe('Sobre Nós');
  });

  it('has correct German translation for heroTitle', () => {
    expect(aboutPage.de['aboutPage.heroTitle']).toBe('Über Uns');
  });

  it('has correct Chinese translation for heroTitle', () => {
    expect(aboutPage.zh['aboutPage.heroTitle']).toBe('关于我们');
  });
});
