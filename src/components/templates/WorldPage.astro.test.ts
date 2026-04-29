import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'WorldPage.astro');

describe('WorldPage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports PageLayout from layouts/PageLayout.astro', () => {
    expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
  });

  it('imports Locales type from i18n/ui', () => {
    expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
  });

  it('imports the worldPage dictionary and usePageTranslations helper', () => {
    expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
    expect(templateContent).toMatch(/import\s+\{\s*worldPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/world-page["']/);
  });

  it('declares Props interface with lang: Locales and reads Astro.props', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
  });

  it('creates a page-scoped translator using lang and worldPage dictionary', () => {
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*worldPage\)/);
  });

  it('wraps the page in PageLayout and renders the translated world page title', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<h1[\s\S]*\{t\('worldPage\.title'\)\}[\s\S]*<\/h1>[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
  });

  it('keeps the template structurally minimal and ready for future content', () => {
    expect(templateContent).toContain('<header class="flex flex-col gap-4">');
    expect(templateContent).toContain('max-w-6xl');
    expect(templateContent).not.toContain("t('aboutPage.");
    expect(templateContent).not.toContain("t('home.");
  });
});
