/**
 * Tests for PageLayout.astro
 *
 * Verifies:
 * 1. PageLayout has the full document shell (doctype, html, head, body)
 *    with the global CSS import — matching the Layout.astro contract.
 * 2. PageLayout renders Header with locale prop, main slot, FooterSection with lang prop.
 * 3. Prop types: lang: Locales.
 *
 * Strategy: Static template content inspection (Astro files cannot be
 * rendered in vitest without an Astro renderer, so we read the raw source).
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const COMPONENT_PATH = resolve(__dirname, 'PageLayout.astro');

describe('PageLayout.astro — structure and document shell', () => {
  let templateContent: string;

  beforeAll(() => {
    templateContent = readFileSync(COMPONENT_PATH, 'utf-8');
  });

  describe('document shell', () => {
    it('has a <!doctype html> declaration', () => {
      expect(templateContent).toContain('<!doctype html>');
    });

    it('opens an <html> tag with lang attribute', () => {
      expect(templateContent).toMatch(/<html\s[^>]*lang=/);
    });

    it('has a <head> section', () => {
      expect(templateContent).toContain('<head>');
    });

    it('has a <body> tag with id="site-top" and header padding style', () => {
      expect(templateContent).toContain('id="site-top"');
      expect(templateContent).toContain('padding-top: var(--header-height');
    });

    it('imports global.css from styles directory', () => {
      // Quote-style agnostic: check for the import statement pattern
      expect(templateContent).toMatch(/import\s+["']\.\.\/styles\/global\.css["']/);
    });
  });

  describe('component composition', () => {
    it('imports Header from ui/Header.astro', () => {
      expect(templateContent).toMatch(/import\s+Header\s+from\s+["']\.\.\/components\/ui\/Header\.astro["']/);
    });

    it('imports FooterSection from organisms/FooterSection.astro', () => {
      expect(templateContent).toMatch(/import\s+FooterSection\s+from\s+["']\.\.\/components\/organisms\/FooterSection\.astro["']/);
    });

    it('renders Header with locale={lang} prop', () => {
      expect(templateContent).toMatch(/<Header\s[^>]*locale=\{lang\}/);
    });

    it('renders a <main> element containing <slot />', () => {
      expect(templateContent).toMatch(/<main[^>]*>[\s\S]*<slot\s*\/>[\s\S]*<\/main>/);
    });

    it('renders FooterSection with lang={lang} prop', () => {
      expect(templateContent).toMatch(/<FooterSection\s[^>]*lang=\{lang\}/);
    });
  });

  describe('prop interface', () => {
    it('declares Props interface with lang: Locales', () => {
      expect(templateContent).toMatch(/lang:\s*Locales/);
    });

    it('imports Locales type from i18n/ui', () => {
      expect(templateContent).toMatch(/import\s+type\s+\{[^}]*Locales[^}]*\}\s+from\s+["']\.\.\/i18n\/ui["']/);
    });

    it('destructures lang from Astro.props', () => {
      expect(templateContent).toMatch(/const\s+\{\s*lang\s*\}\s+=\s+Astro\.props/);
    });
  });

  describe('style block', () => {
    it('has a <style> block that resets html/body box-sizing, margin, padding, width, height', () => {
      expect(templateContent).toContain('box-sizing: border-box');
      expect(templateContent).toContain('margin: 0');
      expect(templateContent).toContain('padding: 0');
      expect(templateContent).toContain('width: 100%');
      expect(templateContent).toContain('height: 100%');
    });
  });
});