import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const FEATURED_LAUNCH_PATH = resolve(__dirname, './FeaturedLaunch.astro');

describe('FeaturedLaunch.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(FEATURED_LAUNCH_PATH, 'utf-8');
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
    expect(templateContent).toContain('<LaunchMediaPlaceholder />');
    expect(templateContent).toContain('<LaunchContent />');
  });

  it('keeps the organism Astro-only with no client directives or ui imports', () => {
    expect(templateContent).not.toContain('use client');
    expect(templateContent).not.toContain('<script');
    expect(templateContent).not.toContain("from '../ui/");
    expect(templateContent).not.toContain("from '../../ui/");
  });
});
