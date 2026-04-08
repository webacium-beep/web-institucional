import { describe, it, expect } from 'vitest';
import { parseAcceptLanguage } from './middleware';

/**
 * Unit tests for parseAcceptLanguage — runs in the default `node` environment.
 *
 * Covers:
 * - Empty / missing header fallback
 * - q-value priority ordering
 * - Unsupported locale fallback to default
 * - Region tag stripping (e.g. "en-US" → "en")
 */

describe('parseAcceptLanguage', () => {
  describe('empty / missing header', () => {
    it('returns "es" for an empty string', () => {
      expect(parseAcceptLanguage('')).toBe('es');
    });

    it('returns "es" when header is whitespace only', () => {
      expect(parseAcceptLanguage('   ')).toBe('es');
    });
  });

  describe('single locale', () => {
    it('returns the locale when it is supported', () => {
      expect(parseAcceptLanguage('en')).toBe('en');
    });

    it('strips region tag and returns base language', () => {
      expect(parseAcceptLanguage('en-US')).toBe('en');
    });

    it('returns "es" when the single locale is unsupported', () => {
      expect(parseAcceptLanguage('fr')).toBe('es');
    });
  });

  describe('q-value priority', () => {
    it('returns the locale with the highest q-value', () => {
      // de has q=0.9, en has q=0.8 → de should win
      expect(parseAcceptLanguage('en;q=0.8,de;q=0.9')).toBe('de');
    });

    it('handles missing q-value (defaults to 1.0) vs explicit q', () => {
      // zh implicit 1.0 beats en;q=0.7
      expect(parseAcceptLanguage('zh,en;q=0.7')).toBe('zh');
    });

    it('skips unsupported locales and picks the next supported one', () => {
      // fr is unsupported, pt should be returned
      expect(parseAcceptLanguage('fr;q=0.9,pt;q=0.8')).toBe('pt');
    });
  });

  describe('supported locales coverage', () => {
    const supported = ['es', 'en', 'de', 'zh', 'pt', 'it'] as const;
    for (const locale of supported) {
      it(`accepts "${locale}" as a supported locale`, () => {
        expect(parseAcceptLanguage(locale)).toBe(locale);
      });
    }
  });

  describe('unsupported locale fallback', () => {
    it('returns "es" for an entirely unsupported header', () => {
      expect(parseAcceptLanguage('fr,ja,ko')).toBe('es');
    });
  });
});
