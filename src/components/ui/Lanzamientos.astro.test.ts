import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, './Lanzamientos.astro');

describe('Lanzamientos.astro', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  it('fetches lanzamientos content from Sanity using the dedicated query', () => {
    expect(templateContent).toContain('sanityClient');
    expect(templateContent).toContain('LANZAMIENTOS_QUERY');
    expect(templateContent).toContain('buildLanzamientosSanityState');
  });

  it('reads the lanzamientos i18n keys from the shared catalog', () => {
    expect(templateContent).toContain("t('lanzamientos.badgePrefix')");
    expect(templateContent).toContain("t('lanzamientos.badgeHighlight')");
    expect(templateContent).toContain("t('lanzamientos.title')");
    expect(templateContent).toContain("t('lanzamientos.description')");
    expect(templateContent).toContain("t('lanzamientos.cta')");
  });

  it('renders a real image branch and a placeholder fallback branch', () => {
    expect(templateContent).toContain('state.hasImage');
    expect(templateContent).toContain('<img');
    expect(templateContent).toContain('bg-neutral-200');
  });
});
