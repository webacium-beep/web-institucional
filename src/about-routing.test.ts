/**
 * Tests for about-us-routing-layout change
 *
 * Verifies:
 * 1. All 6 About localized route files exist and follow the correct pattern.
 * 2. Each route file imports AboutPage, uses normalizeLocale, and renders
 *    <AboutPage lang={lang}>.
 * 3. Header.astro nav.about href is locale-aware: /about for es, /{locale}/about for others.
 *
 * Strategy: Static file-content inspection via readFileSync.
 * Paths are relative to the project root (absolute paths used throughout).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const ROOT = resolve(__dirname, '..');

const ROUTES = [
  { file: resolve(ROOT, 'src/pages/about.astro'), locale: 'es', path: '/about' },
  { file: resolve(ROOT, 'src/pages/en/about.astro'), locale: 'en', path: '/en/about' },
  { file: resolve(ROOT, 'src/pages/de/about.astro'), locale: 'de', path: '/de/about' },
  { file: resolve(ROOT, 'src/pages/pt/about.astro'), locale: 'pt', path: '/pt/about' },
  { file: resolve(ROOT, 'src/pages/it/about.astro'), locale: 'it', path: '/it/about' },
  { file: resolve(ROOT, 'src/pages/zh/about.astro'), locale: 'zh', path: '/zh/about' },
] as const;

const HEADER_PATH = resolve(ROOT, 'src/components/ui/Header.astro');
const FOOTER_PATH = resolve(ROOT, 'src/components/organisms/FooterSection.astro');
const ABOUT_SECTION_PATH = resolve(ROOT, 'src/components/ui/AboutSection.astro');
const NAVIGATION_LIB_PATH = resolve(ROOT, 'src/lib/site-navigation.ts');

describe('About localized route files', () => {
  let headerContent: string;
  let footerContent: string;
  let aboutSectionContent: string;
  let navigationLibContent: string;

  beforeAll(() => {
    headerContent = readFileSync(HEADER_PATH, 'utf-8');
    footerContent = readFileSync(FOOTER_PATH, 'utf-8');
    aboutSectionContent = readFileSync(ABOUT_SECTION_PATH, 'utf-8');
    navigationLibContent = readFileSync(NAVIGATION_LIB_PATH, 'utf-8');
  });

  describe.each(ROUTES)('src/pages$route.path', ({ file, locale, path }) => {
    let content: string;

    beforeAll(() => {
      content = readFileSync(file, 'utf-8');
    });

    it(`(${path}) — file exists`, () => {
      expect(existsSync(file)).toBe(true);
    });

    it(`(${path}) — imports AboutPage from templates/AboutPage.astro`, () => {
      expect(content).toMatch(/import\s+AboutPage\s+from\s+['"][^'"]*components\/templates\/AboutPage\.astro['"]/);
    });

    it(`(${path}) — imports normalizeLocale from i18n/utils`, () => {
      expect(content).toMatch(/import\s+\{[^}]*normalizeLocale[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
    });

    it(`(${path}) — resolves lang via normalizeLocale(Astro.currentLocale)`, () => {
      expect(content).toMatch(/const\s+lang\s*=\s*normalizeLocale\s*\(\s*Astro\.currentLocale\s*\)/);
    });

    it(`(${path}) — renders <AboutPage lang={lang} />`, () => {
      expect(content).toMatch(/<AboutPage\s+lang=\{lang\}\s*\/>/);
    });
  });

  describe('Header.astro — nav.about href', () => {
    it('renders an anchor element for nav.about with locale-aware href', () => {
      expect(headerContent).toMatch(/data-text=\{t\(['"]nav\.about['"]\)\}/);
    });

    it('imports the shared localized navigation helper', () => {
      expect(headerContent).toMatch(/import\s+\{\s*getLocalizedPageHref,\s*PAGE_ROUTE_ID\s*\}\s+from\s+['"][^'"]*site-navigation['"]/);
    });

    it('computes aboutHref via the shared helper', () => {
      expect(headerContent).toMatch(/const\s+aboutHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.ABOUT,\s*safeLocale\)/);
      expect(headerContent).toMatch(/href=\{aboutHref\}/);
    });

    it('nav.about anchor still uses t() for the visible label and aria text', () => {
      expect(headerContent).toMatch(/\{t\(['"]nav\.about['"]\)\}/);
    });

    it('other nav links (world, franchise, newsroom) remain href="#"', () => {
      // Check that nav.world, nav.franchise, nav.newsroom still have href="#"
      // by ensuring their anchor tags do NOT have the locale-aware ternary href
      // and still have href="#"
      const worldLink = headerContent.match(/<a\s[^>]*data-text=\{t\(['"]nav\.world['"]\)\}[^>]*>/)?.[0];
      const franchiseLink = headerContent.match(/<a\s[^>]*data-text=\{t\(['"]nav\.franchise['"]\)\}[^>]*>/)?.[0];
      const newsroomLink = headerContent.match(/<a\s[^>]*data-text=\{t\(['"]nav\.newsroom['"]\)\}[^>]*>/)?.[0];
      expect(worldLink).toContain('href="#"');
      expect(franchiseLink).toContain('href="#"');
      expect(newsroomLink).toContain('href="#"');
    });
  });

  describe('FooterSection.astro — nav.about href', () => {
    it('gets localized footer data by passing lang into the footer data resolver', () => {
      expect(footerContent).toMatch(/const\s+footerData\s*=\s*getFooterData\(lang\)/);
    });

    it('renders footer navigation from the resolved footerData navigation array', () => {
      expect(footerContent).toMatch(/footerData\.navigation\.map\(\(item\)\s*=>/);
    });
  });

  describe('AboutSection.astro — CTA href', () => {
    it('uses the shared localized navigation helper', () => {
      expect(aboutSectionContent).toMatch(/import\s+\{\s*getLocalizedPageHref,\s*PAGE_ROUTE_ID\s*\}\s+from\s+['"][^'"]*site-navigation['"]/);
      expect(aboutSectionContent).toMatch(/const\s+aboutHref\s*=\s*getLocalizedPageHref\(PAGE_ROUTE_ID\.ABOUT,\s*lang\)/);
    });

    it('renders the CTA as a link to aboutHref', () => {
      expect(aboutSectionContent).toMatch(/<a\s+href=\{aboutHref\}/);
      expect(aboutSectionContent).not.toMatch(/<button\s/);
    });
  });

  describe('site-navigation.ts — shared localized about route', () => {
    it('declares the ABOUT route id constant', () => {
      expect(navigationLibContent).toMatch(/ABOUT:\s*['"]about['"]/);
    });

    it('maps ABOUT to /about for es and /{locale}/about otherwise', () => {
      expect(navigationLibContent).toMatch(/if\s*\(page\s*===\s*PAGE_ROUTE_ID\.ABOUT\)\s*\{/);
      expect(navigationLibContent).toMatch(/return\s+safeLang\s*===\s*['"]es['"]\s*\?\s*['"]\/about['"]\s*:\s*`\/\$\{safeLang\}\/about`/);
    });
  });
});
