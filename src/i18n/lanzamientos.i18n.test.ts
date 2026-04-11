import { describe, expect, it } from 'vitest';

import { ui } from './ui';
import { useTranslations } from './utils';

describe('lanzamientos i18n copy', () => {
  it('defines lanzamientos keys for every locale', () => {
    for (const locale of Object.keys(ui) as Array<keyof typeof ui>) {
      expect(ui[locale]['lanzamientos.badgePrefix'].length).toBeGreaterThan(0);
      expect(ui[locale]['lanzamientos.badgeHighlight'].length).toBeGreaterThan(0);
      expect(ui[locale]['lanzamientos.title'].length).toBeGreaterThan(0);
      expect(ui[locale]['lanzamientos.description'].length).toBeGreaterThan(0);
      expect(ui[locale]['lanzamientos.cta'].length).toBeGreaterThan(0);
    }
  });

  it('falls back to spanish copy for unknown locales', () => {
    const t = useTranslations('fr');

    expect(t('lanzamientos.badgePrefix')).toBe(ui.es['lanzamientos.badgePrefix']);
    expect(t('lanzamientos.badgeHighlight')).toBe(ui.es['lanzamientos.badgeHighlight']);
    expect(t('lanzamientos.title')).toBe(ui.es['lanzamientos.title']);
    expect(t('lanzamientos.description')).toBe(ui.es['lanzamientos.description']);
    expect(t('lanzamientos.cta')).toBe(ui.es['lanzamientos.cta']);
  });
});
