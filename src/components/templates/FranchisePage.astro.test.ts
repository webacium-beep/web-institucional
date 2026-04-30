import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'FranchisePage.astro');

describe('FranchisePage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports PageLayout, Locales, usePageTranslations, and franchisePage', () => {
    expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
    expect(templateContent).toMatch(/import\s+\{\s*franchisePage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/franchise-page["']/);
  });

  it('declares lang: Locales props and creates a page-scoped translator', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*franchisePage\)/);
  });

  it('maps benefits and requirements from franchisePage keys only', () => {
    expect(templateContent).toContain('const benefits = [');
    expect(templateContent).toContain("'franchisePage.benefits.item3'");
    expect(templateContent).toContain('const requirements = [');
    expect(templateContent).toContain("'franchisePage.requirements.item3'");
  });

  it('wraps the page in PageLayout and article', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
  });

  it('renders standalone franchise foundation sections semantically', () => {
    expect(templateContent).toContain("{t('franchisePage.title')}");
    expect(templateContent).toContain('aria-labelledby="franchise-intro-title"');
    expect(templateContent).toContain('aria-labelledby="franchise-foundation-title"');
    expect(templateContent).toContain('aria-labelledby="franchise-support-title"');
    expect(templateContent).toContain('aria-labelledby="franchise-cta-title"');
    expect(templateContent).toContain("{t('franchisePage.hero.title')}");
    expect(templateContent).toContain("{t('franchisePage.support.description')}");
    expect(templateContent).toContain("{t('franchisePage.cta.button')}");
    expect(templateContent).toContain('href="mailto:aciummilano@acium.group?subject=Franchise%20Opportunity"');
  });

  it('keeps the page owned by the franchisePage namespace instead of shared Home keys', () => {
    expect(templateContent).not.toContain("t('franchise.title'");
    expect(templateContent).not.toContain("t('franchise.description'");
    expect(templateContent).not.toContain("t('home.");
  });
});
