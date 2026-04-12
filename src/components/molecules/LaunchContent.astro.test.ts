import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const MEDIA_PLACEHOLDER_PATH = resolve(__dirname, './LaunchMediaPlaceholder.astro');
const CONTENT_PATH = resolve(__dirname, './LaunchContent.astro');

describe('LaunchMediaPlaceholder.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(MEDIA_PLACEHOLDER_PATH, 'utf-8');
  });

  it('renders the responsive placeholder shell with gray background', () => {
    expect(templateContent).toContain('<div');
    expect(templateContent).toContain('w-full');
    expect(templateContent).toContain('md:w-1/2');
    expect(templateContent).toContain('flex-1');
    expect(templateContent).toContain('md:flex-none');
    expect(templateContent).toContain('bg-gray-200');
  });

  it('accepts an optional fallbackText prop and renders it when provided', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('fallbackText?: string;');
    expect(templateContent).toContain('const { fallbackText } = Astro.props;');
    expect(templateContent).toContain('{fallbackText && <span>{fallbackText}</span>}');
  });

  it('keeps a default slot for future media content', () => {
    expect(templateContent).toContain('<slot />');
  });

  it('keeps i18n imports out of the molecule', () => {
    expect(templateContent).not.toMatch(/from ['"].*i18n\//);
  });
});

describe('LaunchContent.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(CONTENT_PATH, 'utf-8');
  });

  it('imports the four launch atoms', () => {
    expect(templateContent).toContain("import LaunchTagline from '../atoms/LaunchTagline.astro';");
    expect(templateContent).toContain("import LaunchTitle from '../atoms/LaunchTitle.astro';");
    expect(templateContent).toContain("import LaunchDescription from '../atoms/LaunchDescription.astro';");
    expect(templateContent).toContain("import LaunchCTA from '../atoms/LaunchCTA.astro';");
  });

  it('renders the responsive centered content column', () => {
    expect(templateContent).toContain('w-full');
    expect(templateContent).toContain('md:w-1/2');
    expect(templateContent).toContain('flex-1');
    expect(templateContent).toContain('md:flex-none');
    expect(templateContent).toContain('flex-col');
    expect(templateContent).toContain('justify-center');
    expect(templateContent).toContain('items-start');
    expect(templateContent).toContain('px-8');
  });

  it('accepts translated props for each piece of launch copy', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('tagline: string;');
    expect(templateContent).toContain('title: string;');
    expect(templateContent).toContain('description: string;');
    expect(templateContent).toContain('ctaText: string;');
    expect(templateContent).toContain('const { tagline, title, description, ctaText } = Astro.props;');
  });

  it('forwards each prop to the matching atom through the text prop', () => {
    expect(templateContent).toContain('<LaunchTagline text={tagline} />');
    expect(templateContent).toContain('<LaunchTitle text={title} />');
    expect(templateContent).toContain('<LaunchDescription text={description} />');
    expect(templateContent).toContain('<LaunchCTA text={ctaText} />');
  });

  it('composes the atoms in the expected order', () => {
    const taglineIndex = templateContent.indexOf('<LaunchTagline text={tagline} />');
    const titleIndex = templateContent.indexOf('<LaunchTitle text={title} />');
    const descriptionIndex = templateContent.indexOf('<LaunchDescription text={description} />');
    const ctaIndex = templateContent.indexOf('<LaunchCTA text={ctaText} />');

    expect(taglineIndex).toBeGreaterThan(-1);
    expect(titleIndex).toBeGreaterThan(taglineIndex);
    expect(descriptionIndex).toBeGreaterThan(titleIndex);
    expect(ctaIndex).toBeGreaterThan(descriptionIndex);
  });

  it('keeps i18n imports out of the content molecule', () => {
    expect(templateContent).not.toMatch(/from ['"].*i18n\//);
  });
});
