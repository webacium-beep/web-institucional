import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'EngravingPage.astro');

describe('EngravingPage.astro - template composition', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('imports PageLayout, Locales, translator, engravingPage dictionary, and section assets', () => {
    expect(templateContent).toMatch(/import\s+PageLayout\s+from\s+["']\.\.\/\.\.\/layouts\/PageLayout\.astro["']/);
    expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/\.\.\/i18n\/ui["']/);
    expect(templateContent).toMatch(/import\s+\{\s*usePageTranslations\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/utils["']/);
    expect(templateContent).toMatch(/import\s+\{\s*engravingPage\s*\}\s+from\s+["']\.\.\/\.\.\/i18n\/engraving-page["']/);
    expect(templateContent).toContain("import engravingBanner from '../../assets/section_engraving/banner.svg';");
    expect(templateContent).toContain("import engravingIconMemory from '../../assets/section_engraving/icons/icon_grabado.svg';");
    expect(templateContent).toContain("import engravingIconMaterials from '../../assets/section_engraving/icons/icon_materiales.svg';");
    expect(templateContent).toContain("import engravingIconDesign from '../../assets/section_engraving/icons/ICONOS_GRABADO_1_4.svg';");
    expect(templateContent).toContain("import engravingIconTechnology from '../../assets/section_engraving/icons/icon_tecnologia.svg';");
  });

  it('declares lang: Locales props and creates a page-scoped translator', () => {
    expect(templateContent).toMatch(/lang:\s*Locales/);
    expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    expect(templateContent).toMatch(/const\s+t\s*=\s*usePageTranslations\(lang,\s*engravingPage\)/);
    expect(templateContent).toContain("const heroDescription = t('engravingPage.hero.description');");
    expect(templateContent).toContain("const [heroDescriptionBeforeBrand, heroDescriptionAfterBrand = ''] = heroDescription.split('A C I U M');");
    expect(templateContent).toContain("const storyTitle = t('engravingPage.story.title');");
    expect(templateContent).toContain("const [storyTitleBeforeBrand, storyTitleAfterBrand = ''] = storyTitle.split('A C I U M');");
    expect(templateContent).toContain('const engravingVideoSrc: string | null = null;');
  });

  it('builds the icon grid with approved titles and descriptions', () => {
    expect(templateContent).toContain('const engravingIcons = [');
    expect(templateContent).toContain("title: 'engravingPage.icons.precision.title'");
    expect(templateContent).toContain("title: 'engravingPage.icons.technology.title'");
    expect(templateContent).toContain("title: 'engravingPage.icons.meaning.title'");
    expect(templateContent).toContain("title: 'engravingPage.icons.materials.title'");
    expect(templateContent).toContain("description: 'engravingPage.icons.precision.description'");
    expect(templateContent).toContain("description: 'engravingPage.icons.materials.description'");
  });

  it('wraps the page in PageLayout and renders only the approved design sections', () => {
    expect(templateContent).toMatch(/<PageLayout\s[^>]*lang=\{lang\}[\s\S]*<article[\s\S]*<\/article>[\s\S]*<\/PageLayout>/);
    expect(templateContent).toContain('aria-labelledby="engraving-hero-title"');
    expect(templateContent).toContain('aria-labelledby="engraving-story-title"');
    expect(templateContent).toContain('aria-labelledby="engraving-experience-title"');
    expect(templateContent).toContain("{t('engravingPage.hero.title')}");
    expect(templateContent).toContain('{heroDescriptionBeforeBrand}');
    expect(templateContent).toContain('{heroDescriptionAfterBrand}');
    expect(templateContent).toContain('{t(item.title)}');
    expect(templateContent).toContain('{t(item.description)}');
    expect(templateContent).toContain('{storyTitleBeforeBrand}A C I U M');
    expect(templateContent).toContain("{t('engravingPage.story.description')}");
    expect(templateContent).toContain("{t('engravingPage.experience.title')}");
    expect(templateContent).toContain("{t('engravingPage.experience.description')}");
    expect(templateContent).toContain('{engravingIcons.map((item) => (');
    expect(templateContent).toContain('data-engraving-video-placeholder');
    expect(templateContent).toContain('<video class="h-[465px] w-full object-cover" controls playsinline preload="metadata">');
  });

  it('does not consume unrelated page namespaces', () => {
    expect(templateContent).not.toContain("t('aboutPage.");
    expect(templateContent).not.toContain("t('worldPage.");
    expect(templateContent).not.toContain("t('privacyPage.");
    expect(templateContent).not.toContain("t('franchisePage.");
    expect(templateContent).not.toContain("t('engravingPage.features.");
  });
});
