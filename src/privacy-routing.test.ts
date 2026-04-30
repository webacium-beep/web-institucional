import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/privacy.astro'), path: '/privacy' },
  { file: resolve(ROOT, 'src/pages/en/privacy.astro'), path: '/en/privacy' },
  { file: resolve(ROOT, 'src/pages/de/privacy.astro'), path: '/de/privacy' },
  { file: resolve(ROOT, 'src/pages/pt/privacy.astro'), path: '/pt/privacy' },
  { file: resolve(ROOT, 'src/pages/it/privacy.astro'), path: '/it/privacy' },
  { file: resolve(ROOT, 'src/pages/zh/privacy.astro'), path: '/zh/privacy' },
] as const;

const HEADER_PATH = resolve(ROOT, 'src/components/ui/Header.astro');
const FOOTER_PATH = resolve(ROOT, 'src/components/organisms/FooterSection.astro');
const FOOTER_LIB_PATH = resolve(ROOT, 'src/lib/footer.ts');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('Privacy localized route files', () => {
  let headerContent: string;
  let footerContent: string;
  let footerLibContent: string;
  let navigationLibContent: string;

  beforeAll(() => {
    headerContent = readFileSync(HEADER_PATH, 'utf-8');
    footerContent = readFileSync(FOOTER_PATH, 'utf-8');
    footerLibContent = readFileSync(FOOTER_LIB_PATH, 'utf-8');
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

    it(`(${path}) - imports PrivacyPage from templates/PrivacyPage.astro`, () => {
      expect(content).toMatch(/import\s+PrivacyPage\s+from\s+['"][^'"]*components\/templates\/PrivacyPage\.astro['"]/);
    });

    it(`(${path}) - imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) - resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) - renders <PrivacyPage lang={lang} />`, () => {
      expect(content).toMatch(/<PrivacyPage\s+lang=\{lang\}\s*\/>/);
    });
  });

  it('Header.astro does not introduce privacy navigation', () => {
    expect(headerContent).not.toContain('footer.privacy');
    expect(headerContent).not.toContain('PAGE_ROUTE_ID.PRIVACY');
    expect(headerContent).not.toContain('privacyHref');
    expect(headerContent).not.toMatch(/data-text=\{t\(['"]footer\.privacy['"]\)\}/);
  });

  it('FooterSection.astro still renders footer navigation from resolved footerData', () => {
    expect(footerContent).toMatch(/const\s+footerData\s*=\s*getFooterData\(lang\)/);
    expect(footerContent).toMatch(/footerData\.navigation\.map\(\(item\)\s*=>/);
  });

  it('footer.ts centralizes the privacy item through PAGE_ROUTE_ID.PRIVACY', () => {
    expect(footerLibContent).toContain("id: 'privacy'");
    expect(footerLibContent).toContain("labelKey: 'footer.privacy'");
    expect(footerLibContent).toContain('routeId: PAGE_ROUTE_ID.PRIVACY');
  });

  it('site-navigation.ts exposes a localized PRIVACY route', () => {
    expect(navigationLibContent).toMatch(/PRIVACY:\s*['"]privacy['"]/);
    expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.PRIVACY\)\s*\{/);
    expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/privacy['"]\s*:\s*`\/\$\{safeLang\}\/privacy`/);
  });
});
