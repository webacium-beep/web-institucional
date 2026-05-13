import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/engraving.astro'), path: '/engraving' },
  { file: resolve(ROOT, 'src/pages/en/engraving.astro'), path: '/en/engraving' },
  { file: resolve(ROOT, 'src/pages/de/engraving.astro'), path: '/de/engraving' },
  { file: resolve(ROOT, 'src/pages/pt/engraving.astro'), path: '/pt/engraving' },
  { file: resolve(ROOT, 'src/pages/it/engraving.astro'), path: '/it/engraving' },
  { file: resolve(ROOT, 'src/pages/zh/engraving.astro'), path: '/zh/engraving' },
] as const;

const ENGRAVING_SECTION_PATH = resolve(ROOT, 'src/components/organisms/EngravingSection.astro');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('Engraving localized route files', () => {
  let engravingSectionContent: string;
  let navigationLibContent: string;

  beforeAll(() => {
    engravingSectionContent = readFileSync(ENGRAVING_SECTION_PATH, 'utf-8');
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

    it(`(${path}) - imports EngravingPage from templates/EngravingPage.astro`, () => {
      expect(content).toMatch(/import\s+EngravingPage\s+from\s+['"][^'"]*components\/templates\/EngravingPage\.astro['"]/);
    });

    it(`(${path}) - imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) - resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) - renders <EngravingPage lang={lang} />`, () => {
      expect(content).toMatch(/<EngravingPage\s+lang=\{lang\}\s*\/>/);
    });
  });

  it('EngravingSection.astro routes its CTA through the shared localized helper', () => {
    expect(engravingSectionContent).toMatch(/import\s+\{\s*getLocalizedPageHref,\s*PAGE_ROUTE_ID\s*\}\s+from\s+['"][^'"]*site-navigation['"]/);
    expect(engravingSectionContent).toMatch(/const\s+ctaHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.ENGRAVING,\s*lang\)/);
    expect(engravingSectionContent).toMatch(/href=\{ctaHref\}/);
  });

  it('site-navigation.ts exposes a localized ENGRAVING route', () => {
    expect(navigationLibContent).toMatch(/ENGRAVING:\s*['"]engraving['"]/);
    expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.ENGRAVING\)\s*\{/);
    expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/engraving['"]\s*:\s*`\/\$\{safeLang\}\/engraving`/);
  });
});
