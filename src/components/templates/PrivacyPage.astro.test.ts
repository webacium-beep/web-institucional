import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'PrivacyPage.astro');

describe('PrivacyPage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports PageLayout, Locales, translator, privacyPage dictionary, and privacy icons', () => {
    expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
    expect(templateContent).toMatch(/import\s+\{\s*privacyPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/privacy-page["']/);
    expect(templateContent).toContain("import responderIcon from '../../assets/PrivacyPageassets/icons/responder.svg';");
    expect(templateContent).toContain("import gestionarIcon from '../../assets/PrivacyPageassets/icons/gestionar.svg';");
    expect(templateContent).toContain("import mejorarIcon from '../../assets/PrivacyPageassets/icons/mejorar.svg';");
  });

  it('declares lang: Locales props and creates a page-scoped translator', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*privacyPage\)/);
  });

  it('maps the expanded lists from privacyPage keys only', () => {
    expect(templateContent).toContain("const informationCollectedItems = [");
    expect(templateContent).toContain("'privacyPage.collection.item5'");
    expect(templateContent).toContain("const usageItems = [");
    expect(templateContent).toContain("label: 'privacyPage.usage.item1'");
    expect(templateContent).toContain("label: 'privacyPage.usage.item2'");
    expect(templateContent).toContain("label: 'privacyPage.usage.item3'");
    expect(templateContent).toContain("const legalBasisItems = [");
    expect(templateContent).toContain("'privacyPage.legalBasis.item3'");
    expect(templateContent).toContain("const rightsItems = [");
    expect(templateContent).toContain("'privacyPage.rights.item4'");
    expect(templateContent).toContain("const dataSharingDescription = t('privacyPage.dataSharing.description');");
    expect(templateContent).toContain("const [dataSharingBeforeBrand, dataSharingAfterBrand = ''] = dataSharingDescription.split('ACIUM');");
  });

  it('wraps the page in PageLayout and article', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
  });

  it('renders the expanded semantic sections with privacyPage keys only', () => {
    expect(templateContent).toContain('aria-labelledby="privacy-intro-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-collection-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-usage-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-consent-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-legal-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-closing-title"');
    expect(templateContent).toContain('aria-labelledby="privacy-contact-title"');
    expect(templateContent).toContain("{t('privacyPage.title')}");
    expect(templateContent).toContain("{t('privacyPage.collection.title')}");
    expect(templateContent).toContain("{t('privacyPage.consent.description')}");
    expect(templateContent).toContain('{dataSharingBeforeBrand}');
    expect(templateContent).toContain('{dataSharingAfterBrand}');
    expect(templateContent).toContain("{t('privacyPage.retention.description')}");
    expect(templateContent).toContain("{t('privacyPage.protection.description')}");
    expect(templateContent).toContain("href={`mailto:${t('privacyPage.contact.email')}`}");
  });

  it('does not consume home or shared page-content namespaces', () => {
    expect(templateContent).not.toContain("t('aboutPage.");
    expect(templateContent).not.toContain("t('worldPage.");
    expect(templateContent).not.toContain("t('newsroomPage.");
    expect(templateContent).not.toContain("t('home.");
  });
});
