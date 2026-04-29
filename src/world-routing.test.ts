import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/world.astro'), locale: 'es', path: '/world' },
  { file: resolve(ROOT, 'src/pages/en/world.astro'), locale: 'en', path: '/en/world' },
  { file: resolve(ROOT, 'src/pages/de/world.astro'), locale: 'de', path: '/de/world' },
  { file: resolve(ROOT, 'src/pages/pt/world.astro'), locale: 'pt', path: '/pt/world' },
  { file: resolve(ROOT, 'src/pages/it/world.astro'), locale: 'it', path: '/it/world' },
  { file: resolve(ROOT, 'src/pages/zh/world.astro'), locale: 'zh', path: '/zh/world' },
] as const;

const HEADER_PATH = resolve(ROOT, 'src/components/ui/Header.astro');
const FOOTER_PATH = resolve(ROOT, 'src/components/organisms/FooterSection.astro');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('World localized route files', () => {
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

    it(`(${path}) — file exists`, () => {
      expect(existsSync(file)).toBe(true);
    });

    it(`(${path}) — imports WorldPage from templates/WorldPage.astro`, () => {
      expect(content).toMatch(/import\s+WorldPage\s+from\s+['"][^'"]*components\/templates\/WorldPage\.astro['"]/);
    });

    it(`(${path}) — imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) — resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) — renders <WorldPage lang={lang} />`, () => {
      expect(content).toMatch(/<WorldPage\s+lang=\{lang\}\s*\/>/);
    });
  });

  it('Header.astro computes and uses worldHref via the shared helper', () => {
    expect(headerContent).toMatch(/const\s+worldHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.WORLD,\s*safeLocale\)/);
    const worldLink = headerContent.match(/<a\s[^>]*href=\{worldHref\}[^>]*data-text=\{t\(['"]nav\.world['"]\)\}[^>]*>/)?.[0];

    expect(worldLink).toContain('href={worldHref}');
    expect(worldLink).toContain("data-text={t('nav.world')}");
  });

  it('FooterSection.astro still renders footer navigation from resolved footerData', () => {
    expect(footerContent).toMatch(/const\s+footerData\s*=\s*getFooterData\(lang\)/);
    expect(footerContent).toMatch(/footerData\.navigation\.map\(\(item\)\s*=>/);
  });

  it('site-navigation.ts exposes a localized WORLD route', () => {
    expect(navigationLibContent).toMatch(/WORLD:\s*['"]world['"]/);
    expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.WORLD\)\s*\{/);
    expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/world['"]\s*:\s*`\/\$\{safeLang\}\/world`/);
  });
});
