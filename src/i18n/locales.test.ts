import { describe, expect, it } from 'vitest';
import { SUPPORTED_LOCALES, type Locales } from './locales';

describe('locales module', () => {
  describe('SUPPORTED_LOCALES', () => {
    it('exports all six required locales', () => {
      const expected = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;
      expect(SUPPORTED_LOCALES).toEqual(expected);
    });

    it('has exactly 6 supported locales', () => {
      expect(SUPPORTED_LOCALES).toHaveLength(6);
    });
  });

  describe('Locales type', () => {
    it('type Locales is assignable with each supported locale', () => {
      const locales: Locales[] = ['es', 'en', 'it', 'pt', 'de', 'zh'];
      expect(locales).toHaveLength(6);
    });
  });
});
