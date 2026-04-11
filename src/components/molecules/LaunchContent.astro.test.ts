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

  it('keeps a default slot for future media content', () => {
    expect(templateContent).toContain('<slot />');
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

  it('composes the atoms in the expected order', () => {
    const taglineIndex = templateContent.indexOf('<LaunchTagline />');
    const titleIndex = templateContent.indexOf('<LaunchTitle />');
    const descriptionIndex = templateContent.indexOf('<LaunchDescription />');
    const ctaIndex = templateContent.indexOf('<LaunchCTA />');

    expect(taglineIndex).toBeGreaterThan(-1);
    expect(titleIndex).toBeGreaterThan(taglineIndex);
    expect(descriptionIndex).toBeGreaterThan(titleIndex);
    expect(ctaIndex).toBeGreaterThan(descriptionIndex);
  });
});
