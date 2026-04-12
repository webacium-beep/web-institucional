import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const FEATURED_LAUNCH_PATH = resolve(__dirname, './FeaturedLaunch.astro');
const LAUNCH_COMPONENTS_WITHOUT_I18N = [
  resolve(__dirname, '../molecules/LaunchContent.astro'),
  resolve(__dirname, '../molecules/LaunchMediaPlaceholder.astro'),
  resolve(__dirname, '../atoms/LaunchTagline.astro'),
  resolve(__dirname, '../atoms/LaunchTitle.astro'),
  resolve(__dirname, '../atoms/LaunchDescription.astro'),
  resolve(__dirname, '../atoms/LaunchCTA.astro'),
];

describe('FeaturedLaunch.astro', () => {
  let templateContent: string;
  let nonI18nLaunchSources: string[];

  beforeAll(() => {
    templateContent = readFileSync(FEATURED_LAUNCH_PATH, 'utf-8');
    nonI18nLaunchSources = LAUNCH_COMPONENTS_WITHOUT_I18N.map((filePath) => readFileSync(filePath, 'utf-8'));
  });

  it('renders the fixed-height responsive organism shell', () => {
    expect(templateContent).toContain('<section');
    expect(templateContent).toContain('w-full');
    expect(templateContent).toContain('h-[600px]');
    expect(templateContent).toContain('flex');
    expect(templateContent).toContain('flex-col');
    expect(templateContent).toContain('md:flex-row');
  });

  it('imports and composes the two launch molecules', () => {
    expect(templateContent).toContain("import LaunchMediaPlaceholder from '../molecules/LaunchMediaPlaceholder.astro';");
    expect(templateContent).toContain("import LaunchContent from '../molecules/LaunchContent.astro';");
    expect(templateContent).toContain('<LaunchMediaPlaceholder fallbackText={mediaFallback} />');
    expect(templateContent).toContain('<LaunchContent tagline={tagline} title={title} description={description} ctaText={ctaText} />');
  });

  it('keeps the organism Astro-only with no client directives or ui imports', () => {
    expect(templateContent).not.toContain('use client');
    expect(templateContent).not.toContain('<script');
    expect(templateContent).not.toContain("from '../ui/");
    expect(templateContent).not.toContain("from '../../ui/");
  });

  it('owns the launch i18n boundary and resolves translated props from lang', () => {
    expect(templateContent).toContain("import { useTranslations } from '../../i18n/utils';");
    expect(templateContent).toContain('interface Props {');
    expect(templateContent).toContain('lang?: string | undefined | null;');
    expect(templateContent).toContain('const { lang } = Astro.props;');
    expect(templateContent).toContain('const t = useTranslations(lang);');
    expect(templateContent).toContain("const tagline = t('launch.tagline');");
    expect(templateContent).toContain("const title = t('launch.title');");
    expect(templateContent).toContain("const description = t('launch.description');");
    expect(templateContent).toContain("const ctaText = t('launch.cta');");
    expect(templateContent).toContain("const mediaFallback = t('launch.mediaFallback');");
  });

  it('removes hardcoded launch copy and keeps i18n imports out of lower layers', () => {
    expect(templateContent).not.toContain('PRÓXIMAMENTE');
    expect(templateContent).not.toContain('Nuevo Lanzamiento');
    expect(templateContent).not.toContain('VER MÁS');
    expect(templateContent).not.toContain('Dije giratorio');

    nonI18nLaunchSources.forEach((source) => {
      expect(source).not.toContain('../i18n/');
      expect(source).not.toContain('../../i18n/');
      expect(source).not.toContain("from '../../i18n/utils'");
      expect(source).not.toContain("from '../i18n/utils'");
    });
  });
});
