import { describe, expect, it } from 'vitest';

import { ui } from './ui';
import { useTranslations } from './utils';

describe('launch i18n copy', () => {
  it('defines launch keys for every locale', () => {
    for (const locale of Object.keys(ui) as Array<keyof typeof ui>) {
      expect(ui[locale]['launch.tagline'].length).toBeGreaterThan(0);
      expect(ui[locale]['launch.title'].length).toBeGreaterThan(0);
      expect(ui[locale]['launch.description'].length).toBeGreaterThan(0);
      expect(ui[locale]['launch.cta'].length).toBeGreaterThan(0);
      expect(ui[locale]['launch.mediaFallback'].length).toBeGreaterThan(0);
    }
  });

  it('matches the spanish reference copy from the spec', () => {
    expect(ui.es['launch.tagline']).toBe('CONOCE EL NUEVO');
    expect(ui.es['launch.title']).toBe('LANZAMIENTO');
    expect(ui.es['launch.description']).toBe('Dije FOREVER');
    expect(ui.es['launch.cta']).toBe('CONOCE MÁS');
    expect(ui.es['launch.mediaFallback']).toBe('Video destacado del lanzamiento');
  });

  it('falls back to spanish launch copy for unknown locales', () => {
    const t = useTranslations('fr');

    expect(t('launch.tagline')).toBe(ui.es['launch.tagline']);
    expect(t('launch.title')).toBe(ui.es['launch.title']);
    expect(t('launch.description')).toBe(ui.es['launch.description']);
    expect(t('launch.cta')).toBe(ui.es['launch.cta']);
    expect(t('launch.mediaFallback')).toBe(ui.es['launch.mediaFallback']);
  });
});
