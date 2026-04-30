import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/franchise.astro'), path: '/franchise' },
  { file: resolve(ROOT, 'src/pages/en/franchise.astro'), path: '/en/franchise' },
  { file: resolve(ROOT, 'src/pages/de/franchise.astro'), path: '/de/franchise' },
  { file: resolve(ROOT, 'src/pages/pt/franchise.astro'), path: '/pt/franchise' },
  { file: resolve(ROOT, 'src/pages/it/franchise.astro'), path: '/it/franchise' },
  { file: resolve(ROOT, 'src/pages/zh/franchise.astro'), path: '/zh/franchise' },
] as const;

const HEADER_PATH = resolve(ROOT, 'src/components/ui/Header.astro');
const FRANCHISE_SECTION_PATH = resolve(ROOT, 'src/components/organisms/FranchiseSection.astro');
const FOOTER_PATH = resolve(ROOT, 'src/components/organisms/FooterSection.astro');
const FOOTER_LIB_PATH = resolve(ROOT, 'src/lib/footer.ts');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('Franchise localized route files', () => {
  let headerContent: string;
  let franchiseSectionContent: string;
  let footerContent: string;
  let footerLibContent: string;
  let navigationLibContent: string;

  beforeAll(() => {
    headerContent = readFileSync(HEADER_PATH, 'utf-8');
    franchiseSectionContent = readFileSync(FRANCHISE_SECTION_PATH, 'utf-8');
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

    it(`(${path}) - imports FranchisePage from templates/FranchisePage.astro`, () => {
      expect(content).toMatch(/import\s+FranchisePage\s+from\s+['"][^'"]*components\/templates\/FranchisePage\.astro['"]/);
    });

    it(`(${path}) - imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) - resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) - renders <FranchisePage lang={lang} />`, () => {
      expect(content).toMatch(/<FranchisePage\s+lang=\{lang\}\s*\/>/);
    });
  });

  it('Header.astro computes and uses franchiseHref via the shared helper', () => {
    expect(headerContent).toMatch(/const\s+franchiseHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.FRANCHISE,\s*safeLocale\)/);
    const franchiseLink = headerContent.match(/<a\s[^>]*href=\{franchiseHref\}[^>]*data-text=\{t\(['"]nav\.franchise['"]\)\}[^>]*>/)?.[0];

    expect(franchiseLink).toContain('href={franchiseHref}');
    expect(franchiseLink).toContain("data-text={t('nav.franchise')}");
  });

  it('FranchiseSection.astro uses the shared localized navigation helper for its CTA', () => {
    expect(franchiseSectionContent).toMatch(/import\s+\{\s*getLocalizedPageHref,\s*PAGE_ROUTE_ID\s*\}\s+from\s+['"][^'"]*site-navigation['"]/);
    expect(franchiseSectionContent).toMatch(/const\s+ctaHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.FRANCHISE,\s*lang\)/);
    expect(franchiseSectionContent).toMatch(/<a\s[\s\S]*href=\{ctaHref\}/);
  });

  it('FooterSection.astro still renders footer navigation from resolved footerData', () => {
    expect(footerContent).toMatch(/const\s+footerData\s*=\s*getFooterData\(lang\)/);
    expect(footerContent).toMatch(/footerData\.navigation\.map\(\(item\)\s*=>/);
  });

  it('footer.ts centralizes the franchise item through PAGE_ROUTE_ID.FRANCHISE', () => {
    expect(footerLibContent).toContain("id: 'franchise'");
    expect(footerLibContent).toContain("labelKey: 'nav.franchise'");
    expect(footerLibContent).toContain('routeId: PAGE_ROUTE_ID.FRANCHISE');
  });

  it('site-navigation.ts exposes a localized FRANCHISE route', () => {
    expect(navigationLibContent).toMatch(/FRANCHISE:\s*['"]franchise['"]/);
    expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.FRANCHISE\)\s*\{/);
    expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/franchise['"]\s*:\s*`\/\$\{safeLang\}\/franchise`/);
  });
});
