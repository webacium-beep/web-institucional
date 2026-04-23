import { describe, expect, it } from 'vitest';

import { ui } from './ui';
import { useTranslations } from './utils';

describe('engraving i18n copy', () => {
  it('defines engraving keys for every locale', () => {
    const engravingKeys = [
      'engraving.hero.title',
      'engraving.card.eyebrow',
      'engraving.card.title',
      'engraving.card.badge',
      'engraving.card.description',
      'engraving.card.cta',
      'engraving.mediaFallback',
    ] as const;

    for (const locale of Object.keys(ui) as Array<keyof typeof ui>) {
      for (const key of engravingKeys) {
        expect(ui[locale][key].length).toBeGreaterThan(0);
      }
    }
  });

  it('matches the spanish reference copy from the figma and content brief', () => {
    expect(ui.es['engraving.hero.title']).toBe('FOTOGRABADO');
    expect(ui.es['engraving.card.eyebrow']).toBe('MOMENTOS');
    expect(ui.es['engraving.card.title']).toBe('GRABADOS');
    expect(ui.es['engraving.card.badge']).toBe('PARA SIEMPRE');
    expect(ui.es['engraving.card.description']).toBe(
      'En ACIUM, creemos que el verdadero lujo reside en el significado. Transformamos la joyería en un lienzo personal a través de nuestra técnica exclusiva de grabado.'
    );
    expect(ui.es['engraving.card.cta']).toBe('CONOCE MÁS');
    expect(ui.es['engraving.mediaFallback']).toBe('Video de fondo de fotograbado');
  });

  it('falls back to spanish engraving copy for unknown locales', () => {
    const t = useTranslations('fr');
    const engravingKeys = [
      'engraving.hero.title',
      'engraving.card.eyebrow',
      'engraving.card.title',
      'engraving.card.badge',
      'engraving.card.description',
      'engraving.card.cta',
      'engraving.mediaFallback',
    ] as const;

    for (const key of engravingKeys) {
      expect(t(key)).toBe(ui.es[key]);
    }
  });
});
