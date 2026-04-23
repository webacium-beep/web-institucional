import { describe, expect, it } from 'vitest';

import { ui } from './ui';
import { useTranslations } from './utils';

describe('newsroom i18n copy', () => {
  it('defines newsroom keys for every locale', () => {
    const newsroomKeys = [
      'newsroom.title',
      'newsroom.description',
      'newsroom.cta',
      'newsroom.galleryPlaceholder',
    ] as const;

    for (const locale of Object.keys(ui) as Array<keyof typeof ui>) {
      for (const key of newsroomKeys) {
        expect(ui[locale][key].length).toBeGreaterThan(0);
      }
    }
  });

  it('matches the spanish reference copy for newsroom', () => {
    expect(ui.es['newsroom.title']).toBe('NEWSROOM');
    expect(ui.es['newsroom.description']).toBe(
      'Explora las últimas novedades, lanzamientos exclusivos y la evolución de nuestra huella global en el mundo de la joyería contemporánea.'
    );
    expect(ui.es['newsroom.cta']).toBe('CONOCE MÁS');
    expect(ui.es['newsroom.galleryPlaceholder']).toBe('Próxima imagen de newsroom');
  });

  it('falls back to spanish newsroom copy for unknown locales', () => {
    const t = useTranslations('fr');
    const newsroomKeys = [
      'newsroom.title',
      'newsroom.description',
      'newsroom.cta',
      'newsroom.galleryPlaceholder',
    ] as const;

    for (const key of newsroomKeys) {
      expect(t(key)).toBe(ui.es[key]);
    }
  });
});
