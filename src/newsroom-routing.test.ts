import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/newsroom.astro'), path: '/newsroom' },
  { file: resolve(ROOT, 'src/pages/en/newsroom.astro'), path: '/en/newsroom' },
  { file: resolve(ROOT, 'src/pages/de/newsroom.astro'), path: '/de/newsroom' },
  { file: resolve(ROOT, 'src/pages/pt/newsroom.astro'), path: '/pt/newsroom' },
  { file: resolve(ROOT, 'src/pages/it/newsroom.astro'), path: '/it/newsroom' },
  { file: resolve(ROOT, 'src/pages/zh/newsroom.astro'), path: '/zh/newsroom' },
] as const;

const HEADER_PATH = resolve(ROOT, 'src/components/ui/Header.astro');
const FOOTER_PATH = resolve(ROOT, 'src/components/organisms/FooterSection.astro');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('Newsroom localized route files', () => {
  let headerContent: string;
  let footerContent: string;
  let navigationLibContent: string;

  beforeAll(() => {
    headerContent = readFileSync(HEADER_PATH, 'utf-8');
    footerContent = readFileSync(FOOTER_PATH, 'utf-8');
    navigationLibContent = readFileSync(NAVIGATION_LIB_PATH, 'utf-8');
  });

  describe.each(ROUTES)('src/pages$route.path', ({ file, path }) => {
    let content: string;

    beforeAll(() => {
      content = readFileSync(file, 'utf-8');
    });

    it(`(${path}) - file exists`, () => {
      expect(existsSync(file)).toBe(true);
    });

    it(`(${path}) - imports NewsroomPage from templates/NewsroomPage.astro`, () => {
      expect(content).toMatch(/import\s+NewsroomPage\s+from\s+['"][^'"]*components\/templates\/NewsroomPage\.astro['"]/);
    });

    it(`(${path}) - imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) - resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) - renders <NewsroomPage lang={lang} />`, () => {
      expect(content).toMatch(/<NewsroomPage\s+lang=\{lang\}\s*\/>/);
    });
  });

  it('Header.astro computes and uses newsroomHref via the shared helper', () => {
    expect(headerContent).toMatch(/const\s+newsroomHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.NEWSROOM,\s*safeLocale\)/);
    const newsroomLink = headerContent.match(/<a\s[^>]*href=\{newsroomHref\}[^>]*data-text=\{t\(['"]nav\.newsroom['"]\)\}[^>]*>/)?.[0];

    expect(newsroomLink).toContain('href={newsroomHref}');
    expect(newsroomLink).toContain("data-text={t('nav.newsroom')}");
  });

  it('FooterSection.astro still renders footer navigation from resolved footerData', () => {
    expect(footerContent).toMatch(/const\s+footerData\s*=\s*getFooterData\(lang\)/);
    expect(footerContent).toMatch(/footerData\.navigation\.map\(\(item\)\s*=>/);
  });

  it('site-navigation.ts exposes a localized NEWSROOM route', () => {
    expect(navigationLibContent).toMatch(/NEWSROOM:\s*['"]newsroom['"]/);
    expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.NEWSROOM\)\s*\{/);
    expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/newsroom['"]\s*:\s*`\/\$\{safeLang\}\/newsroom`/);
  });
});
