import { describe, expect, it } from 'vitest';

import { ui } from './ui';
import { useTranslations } from './utils';

describe('franchise i18n copy', () => {
  // REQ-LOCALE-001: All 6 locales must define every franchise key with non-empty values
  it('defines franchise keys for every locale', () => {
    const franchiseKeys = [
      'franchise.badge',
      'franchise.titleLine1',
      'franchise.titleLine2',
      'franchise.description',
      'franchise.cta',
    ] as const;

    for (const locale of Object.keys(ui) as Array<keyof typeof ui>) {
      for (const key of franchiseKeys) {
        expect(ui[locale][key].length).toBeGreaterThan(0);
      }
    }
  });

  // REQ-ES-001: Spanish source strings must match verbatim from spec
  it('matches the spanish reference copy from the spec', () => {
    expect(ui.es['franchise.badge']).toBe('SE PARTE');
    expect(ui.es['franchise.titleLine1']).toBe('DE NUESTRA');
    expect(ui.es['franchise.titleLine2']).toBe('FRANQUICIA');
    expect(ui.es['franchise.description']).toBe(
      'Te invitamos a expandir nuestra esencia bajo tu propia visión: desde la exclusividad de una Master para conquistar nuevos mercados nacionales, hasta la solidez de una Franquicia de diseño internacional. El límite lo define tu ambición.'
    );
    expect(ui.es['franchise.cta']).toBe('SE PARTE DE A C I U M');
  });

  // REQ-FALLBACK-001: Unknown locales fall back to Spanish
  it('falls back to spanish franchise copy for unknown locales', () => {
    const t = useTranslations('fr');
    const franchiseKeys = [
      'franchise.badge',
      'franchise.titleLine1',
      'franchise.titleLine2',
      'franchise.description',
      'franchise.cta',
    ] as const;

    for (const key of franchiseKeys) {
      expect(t(key)).toBe(ui.es[key]);
    }
  });
});