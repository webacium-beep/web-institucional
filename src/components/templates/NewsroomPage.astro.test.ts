import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'NewsroomPage.astro');

describe('NewsroomPage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports PageLayout, Locales, usePageTranslations, and newsroomPage', () => {
    expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
    expect(templateContent).toMatch(/import\s+\{\s*newsroomPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/newsroom-page["']/);
  });

  it('imports the reusable newsroom assets including category-specific files', () => {
    expect(templateContent).toMatch(/import\s+comingSoonImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/NOWROOM_1\.jpg["']/);
    expect(templateContent).toMatch(/import\s+comingSoonFeatureImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/commingsoon\.svg["']/);
    expect(templateContent).toMatch(/import\s+brazilEventImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/NOWROOM_2\.jpg["']/);
    expect(templateContent).toMatch(/import\s+foreverImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/NOWROOM_3\.jpg["']/);
    expect(templateContent).toMatch(/import\s+chinaRunwayImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/NEWROOM_4\.jpg["']/);
    expect(templateContent).toMatch(/import\s+editorialTeamImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/NOWROOM_05\.jpg["']/);
    expect(templateContent).toMatch(/import\s+launchesCategoryImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/lanzamientos\.webp["']/);
    expect(templateContent).toMatch(/import\s+campaignsCategoryImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/campanas\.webp["']/);
    expect(templateContent).toMatch(/import\s+eventsCategoryImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/eventos\.jpg["']/);
    expect(templateContent).toMatch(/import\s+franchisesCategoryImage\s+from\s+["']\.\.\/\.\.\/assets\/section_new_room_images\/franquicias\.webp["']/);
  });

  it('declares lang: Locales props and creates a page-scoped translator', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*newsroomPage\)/);
  });

  it('defines hero, category, and article collections from newsroomPage keys', () => {
    expect(templateContent).toContain("const heroParagraph1 = t('newsroomPage.hero.paragraph1')");
    expect(templateContent).toContain("heroParagraph1.split('ACIUM')");
    expect(templateContent).toContain('const categories = [');
    expect(templateContent).toContain("title: 'newsroomPage.categories.items.launches.title'");
    expect(templateContent).toContain("title: 'newsroomPage.categories.items.campaigns.title'");
    expect(templateContent).toContain("title: 'newsroomPage.categories.items.events.title'");
    expect(templateContent).toContain("title: 'newsroomPage.categories.items.franchises.title'");
    expect(templateContent).toContain('const articleCards = [');
    expect(templateContent).toContain("title: 'newsroomPage.articles.items.brazil.title'");
    expect(templateContent).toContain("title: 'newsroomPage.articles.items.forever.title'");
    expect(templateContent).toContain("title: 'newsroomPage.articles.items.china.title'");
    expect(templateContent).toContain("title: 'newsroomPage.articles.items.abf.title'");
  });

  it('wraps the page in PageLayout and article', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
  });

  it('renders the standalone newsroom sections semantically', () => {
    expect(templateContent).toContain("{t('newsroomPage.title')}");
    expect(templateContent).toContain('aria-labelledby="newsroom-hero-title"');
    expect(templateContent).toContain('aria-labelledby="newsroom-categories-title"');
    expect(templateContent).toContain('aria-labelledby="newsroom-featured-title"');
    expect(templateContent).toContain("aria-label={t('newsroomPage.articles.ariaLabel')}");
    expect(templateContent).toContain('aria-labelledby="newsroom-closing-title"');
  });

  it('renders the expected newsroomPage keys for hero, featured, articles, and closing copy', () => {
    expect(templateContent).toContain("{t('newsroomPage.hero.title')}");
    expect(templateContent).toContain("{t('newsroomPage.hero.paragraph2')}");
    expect(templateContent).toContain("const featuredDescription = t('newsroomPage.featured.description')");
    expect(templateContent).toContain("const featuredTitle = t('newsroomPage.featured.title')");
    expect(templateContent).toContain("{t('newsroomPage.featured.badge')}");
    expect(templateContent).toContain("{t('newsroomPage.closing.title')}");
    expect(templateContent).toContain("{t('newsroomPage.closing.description')}");
  });

  it('uses a hoverable featured badge button and no hero CTA key', () => {
    expect(templateContent).toContain('<button');
    expect(templateContent).toContain("{t('newsroomPage.featured.badge')}");
    expect(templateContent).toContain('hover:bg-black hover:text-white');
  });

  it('keeps the page owned by the newsroomPage namespace instead of shared Home keys', () => {
    expect(templateContent).not.toContain("t('newsroom.title'");
    expect(templateContent).not.toContain("t('newsroom.description'");
    expect(templateContent).not.toContain("t('home.");
  });
});
