import { describe, expect, it } from 'vitest';

import { newsroomPage, type NewsroomPageContent } from './newsroom-page';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const newsroomPageKeys = [
  'newsroomPage.title',
  'newsroomPage.hero.title',
  'newsroomPage.hero.paragraph1',
  'newsroomPage.hero.paragraph2',
  'newsroomPage.hero.imageAlt',
  'newsroomPage.categories.title',
  'newsroomPage.categories.items.launches.title',
  'newsroomPage.categories.items.launches.imageAlt',
  'newsroomPage.categories.items.campaigns.title',
  'newsroomPage.categories.items.campaigns.imageAlt',
  'newsroomPage.categories.items.events.title',
  'newsroomPage.categories.items.events.imageAlt',
  'newsroomPage.categories.items.franchises.title',
  'newsroomPage.categories.items.franchises.imageAlt',
  'newsroomPage.featured.eyebrow',
  'newsroomPage.featured.date',
  'newsroomPage.featured.title',
  'newsroomPage.featured.badge',
  'newsroomPage.featured.description',
  'newsroomPage.featured.imageAlt',
  'newsroomPage.articles.ariaLabel',
  'newsroomPage.articles.items.brazil.title',
  'newsroomPage.articles.items.brazil.description',
  'newsroomPage.articles.items.brazil.imageAlt',
  'newsroomPage.articles.items.forever.title',
  'newsroomPage.articles.items.forever.description',
  'newsroomPage.articles.items.forever.imageAlt',
  'newsroomPage.articles.items.china.title',
  'newsroomPage.articles.items.china.description',
  'newsroomPage.articles.items.china.imageAlt',
  'newsroomPage.articles.items.abf.title',
  'newsroomPage.articles.items.abf.description',
  'newsroomPage.articles.items.abf.imageAlt',
  'newsroomPage.closing.title',
  'newsroomPage.closing.description',
] as const satisfies readonly (keyof NewsroomPageContent)[];

describe('newsroom-page i18n dictionary', () => {
  it('exports a NewsroomPageContent shape with the full newsroomPage namespace', () => {
    const content: NewsroomPageContent = newsroomPage.es;

    expect(Object.keys(content)).toHaveLength(newsroomPageKeys.length);
    expect(Object.keys(content).sort()).toEqual([...newsroomPageKeys].sort());
  });

  it('defines all six locales in newsroomPage record', () => {
    for (const locale of locales) {
      expect(newsroomPage).toHaveProperty(locale);
    }
  });

  it('defines every expected newsroomPage key for each locale', () => {
    for (const locale of locales) {
      expect(Object.keys(newsroomPage[locale]).sort()).toEqual([...newsroomPageKeys].sort());
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of newsroomPageKeys) {
        expect(newsroomPage[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the Spanish source copy aligned with the newsroom reference image', () => {
    expect(newsroomPage.es['newsroomPage.title']).toBe('NEWSROOM');
    expect(newsroomPage.es['newsroomPage.categories.title']).toBe('CATEGORÍAS');
    expect(newsroomPage.es['newsroomPage.categories.items.franchises.title']).toBe('Franquicias');
    expect(newsroomPage.es['newsroomPage.featured.eyebrow']).toBe('COMING SOON...');
    expect(newsroomPage.es['newsroomPage.featured.date']).toBe('19 - 21 MAY');
    expect(newsroomPage.es['newsroomPage.featured.title']).toBe('ACIUM presenta sus nuevos desarrollos');
    expect(newsroomPage.es['newsroomPage.featured.badge']).toBe('en Masters Di Capri');
    expect(newsroomPage.es['newsroomPage.closing.title']).toBe('Donde hay una historia, hay una oportunidad.');
  });

  it('provides localized page titles for all supported locales', () => {
    for (const locale of locales) {
      expect(newsroomPage[locale]['newsroomPage.title']).toBe('NEWSROOM');
    }
  });

  it('provides localized category labels for all supported locales', () => {
    const expectedLaunchLabels: Record<(typeof locales)[number], string> = {
      es: 'Lanzamientos',
      en: 'Launches',
      it: 'Lanci',
      pt: 'Lançamentos',
      de: 'Neuheiten',
      zh: '新品发布',
    };

    for (const locale of locales) {
      expect(newsroomPage[locale]['newsroomPage.categories.items.launches.title']).toBe(expectedLaunchLabels[locale]);
    }
  });
});
