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

  it('accepts a text prop and renders it inside a semantic paragraph', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('text: string');
    expect(templateContent).toContain('<p');
    expect(templateContent).toContain('{text}');
    expect(templateContent).not.toContain('PRÓXIMAMENTE');
  });

  it('uses the launch typography utility classes for the tagline block', () => {
    expect(templateContent).toContain('text-subtitulo');
    expect(templateContent).toContain('font-light');
    expect(templateContent).toContain('uppercase');
  });

  it('does not import i18n helpers directly', () => {
    expect(templateContent).not.toContain('i18n');
  });
});

describe('LaunchTitle.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(TITLE_PATH, 'utf-8');
  });

  it('accepts a text prop and renders it as an h2 heading', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('text: string');
    expect(templateContent).toContain('<h2');
    expect(templateContent).toContain('{text}');
    expect(templateContent).not.toContain('Nuevo Lanzamiento');
  });

  it('uses the launch typography utility classes on the heading', () => {
    expect(templateContent).toContain('text-titulo');
    expect(templateContent).toContain('font-extrabold');
    expect(templateContent).toContain('uppercase');
  });

  it('does not import i18n helpers directly', () => {
    expect(templateContent).not.toContain('i18n');
  });
});

describe('LaunchDescription.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(DESCRIPTION_PATH, 'utf-8');
  });

  it('accepts a text prop and renders it inside the structural wrapper', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('text: string');
    expect(templateContent).toContain('<div');
    expect(templateContent).toContain('<p');
    expect(templateContent).toContain('{text}');
    expect(templateContent).not.toContain('Descripción del próximo lanzamiento.');
  });

  it('prepares the left border container with the required border and text utilities', () => {
    expect(templateContent).toContain('min-h-[65px]');
    expect(templateContent).toContain('items-center');
    expect(templateContent).toContain('border-l');
    expect(templateContent).toContain('border-black');
    expect(templateContent).toContain('pl-4');
    expect(templateContent).toContain('text-parrafo');
    expect(templateContent).toContain('font-normal');
  });

  it('does not import i18n helpers directly', () => {
    expect(templateContent).not.toContain('i18n');
  });
});

describe('LaunchCTA.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(CTA_PATH, 'utf-8');
  });

  it('defines text and href props with /lanzamientos as the default destination', () => {
    expect(templateContent).toContain('interface Props');
    expect(templateContent).toContain('text: string');
    expect(templateContent).toContain('href?: string');
    expect(templateContent).toContain('href = "/lanzamientos"');
  });

  it('renders the outline CTA anchor with the provided text prop', () => {
    expect(templateContent).toContain('<a');
    expect(templateContent).toContain('border');
    expect(templateContent).toContain('border-black');
    expect(templateContent).toContain('px-6');
    expect(templateContent).toContain('py-2');
    expect(templateContent).toContain('text-center');
    expect(templateContent).toContain('font-extrabold');
    expect(templateContent).toContain('text-[14px]');
    expect(templateContent).toContain('tracking-[0.2em]');
    expect(templateContent).toContain('uppercase');
    expect(templateContent).toContain('hover:bg-black');
    expect(templateContent).toContain('hover:text-white');
    expect(templateContent).toContain('{text}');
    expect(templateContent).not.toContain('VER MÁS');
  });

  it('does not import i18n helpers directly', () => {
    expect(templateContent).not.toContain('i18n');
  });
});
