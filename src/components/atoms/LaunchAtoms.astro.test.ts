import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const TAGLINE_PATH = resolve(__dirname, './LaunchTagline.astro');
const TITLE_PATH = resolve(__dirname, './LaunchTitle.astro');
const DESCRIPTION_PATH = resolve(__dirname, './LaunchDescription.astro');
const CTA_PATH = resolve(__dirname, './LaunchCTA.astro');

describe('LaunchTagline.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(TAGLINE_PATH, 'utf-8');
  });

  it('renders the hardcoded Spanish eyebrow copy inside a semantic paragraph', () => {
    expect(templateContent).toContain('<p');
    expect(templateContent).toContain('PRÓXIMAMENTE');
  });

  it('uses only structural spacing classes for the tagline block', () => {
    expect(templateContent).toContain('block');
    expect(templateContent).toContain('mb-2');
  });
});

describe('LaunchTitle.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(TITLE_PATH, 'utf-8');
  });

  it('renders the hardcoded title as an h2 heading', () => {
    expect(templateContent).toContain('<h2');
    expect(templateContent).toContain('Nuevo Lanzamiento');
  });

  it('keeps only structural spacing classes on the heading', () => {
    expect(templateContent).toContain('mb-3');
  });
});

describe('LaunchDescription.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(DESCRIPTION_PATH, 'utf-8');
  });

  it('renders the placeholder copy inside a structural wrapper', () => {
    expect(templateContent).toContain('<div');
    expect(templateContent).toContain('<p');
    expect(templateContent).toContain('Descripción del próximo lanzamiento.');
  });

  it('prepares the left border container with spacing only classes', () => {
    expect(templateContent).toContain('border-l');
    expect(templateContent).toContain('pl-3');
    expect(templateContent).toContain('mb-6');
  });
});

describe('LaunchCTA.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(CTA_PATH, 'utf-8');
  });

  it('defines an optional href prop with /lanzamientos as the default destination', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('href?: string');
    expect(templateContent).toContain('href = "/lanzamientos"');
  });

  it('renders a structural outline anchor with fallback CTA copy', () => {
    expect(templateContent).toContain('<a');
    expect(templateContent).toContain('border');
    expect(templateContent).toContain('px-5');
    expect(templateContent).toContain('py-2');
    expect(templateContent).toContain('inline-block');
    expect(templateContent).toContain('VER MÁS');
  });
});
