import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'FranchisePage.astro');

describe('FranchisePage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports the franchise and world assets used by the page', () => {
    expect(templateContent).toMatch(/import\s+bannerFranquicia\s+from\s+["']\.\.\/\.\.\/assets\/franquicia_ppage\/banner_franquicia\.png["']/);
    expect(templateContent).toMatch(/import\s+masterFranquiciadoImage\s+from\s+["']\.\.\/\.\.\/assets\/franquicia_ppage\/master_franquiciado\.png["']/);
    expect(templateContent).toMatch(/import\s+franquiciadoImage\s+from\s+["']\.\.\/\.\.\/assets\/franquicia_ppage\/franquicia\.png["']/);
    expect(templateContent).toMatch(/import\s+solicitudEnviadaImage\s+from\s+["']\.\.\/\.\.\/assets\/franquicia_ppage\/solicitud_enviada\.png["']/);
    expect(templateContent).toMatch(/import\s+worldMapImage\s+from\s+["']\.\.\/\.\.\/assets\/worldppage\/SECCION_MAPA_MUNDO\.webp["']/);
  });

  it('declares lang props and creates a page-scoped translator', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*franchisePage\)/);
  });

  it('wraps the page in PageLayout and renders all main franchise sections', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
    expect(templateContent).toContain('franchise-why-title');
    expect(templateContent).toContain('franchise-types-title');
    expect(templateContent).toContain('franchise-map-title');
    expect(templateContent).toContain('franchise-expansion-title');
    expect(templateContent).toContain('franchise-form-title');
    expect(templateContent).toContain('franchise-success-title');
    expect(templateContent).toContain('franchise-next-steps-title');
  });

  it('uses franchisePage keys for the text-driven sections and CTAs', () => {
    expect(templateContent).toContain("const whyTitle = t('franchisePage.why.title');");
    expect(templateContent).toContain("const whyParagraph1 = t('franchisePage.why.paragraph1');");
    expect(templateContent).toContain("{t('franchisePage.types.title')}");
    expect(templateContent).toContain("{t('franchisePage.types.master.label')}");
    expect(templateContent).toContain("{t('franchisePage.types.master.description')}");
    expect(templateContent).toContain("{t('franchisePage.types.design.label')}");
    expect(templateContent).toContain("{t('franchisePage.types.design.description')}");
    expect(templateContent).toContain("{t('franchisePage.map.description')}");
    expect(templateContent).toContain("{t('franchisePage.expansion.title')}");
    expect(templateContent).toContain("{t('franchisePage.expansion.regionAmerica')}");
    expect(templateContent).toContain('id="franchise-stats-country-label"');
    expect(templateContent).toContain('{defaultFranchiseContact.countryName}');
    expect(templateContent).toContain("{t('franchisePage.form.title')}");
    expect(templateContent).toContain("{t('franchisePage.form.fieldCountry')}");
    expect(templateContent).toContain("{t('franchisePage.form.submit')}");
    expect(templateContent).toContain("{t('franchisePage.success.title')}");
    expect(templateContent).toContain("{t('franchisePage.success.cta')}");
    expect(templateContent).toContain("{t('franchisePage.next.title')}");
  });

  it('renders the world map reuse and next-steps icon flow', () => {
    expect(templateContent).toContain('worldMapImageSrc');
    expect(templateContent).toContain('const nextSteps = [');
    expect(templateContent).toContain('iconoSolicitudSrc');
    expect(templateContent).toContain('iconoAnalisisSrc');
    expect(templateContent).toContain('iconoConexionSrc');
    expect(templateContent).toContain('iconoDesarrolloSrc');
    expect(templateContent).toContain("'franchisePage.next.step1.title'");
    expect(templateContent).toContain("'franchisePage.next.step4.description'");
  });

  it('keeps the page owned by the franchisePage namespace instead of shared Home keys', () => {
    expect(templateContent).not.toContain("t('franchise.title'");
    expect(templateContent).not.toContain("t('franchise.description'");
    expect(templateContent).not.toContain("t('home.");
  });
});
