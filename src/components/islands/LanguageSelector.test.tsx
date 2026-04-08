// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector, { buildLocaleUrl } from './LanguageSelector';

// ─── Unit tests: buildLocaleUrl ───────────────────────────────────────────────

describe('buildLocaleUrl', () => {
  describe('root path "/"', () => {
    it('returns "/" for Spanish (default, no prefix)', () => {
      expect(buildLocaleUrl('es', '/')).toBe('/');
    });

    it('returns "/en/" for English from root', () => {
      expect(buildLocaleUrl('en', '/')).toBe('/en/');
    });

    it('returns "/de/" for German from root', () => {
      expect(buildLocaleUrl('de', '/')).toBe('/de/');
    });
  });

  describe('existing locale prefix stripping', () => {
    it('strips /en and returns "/" for Spanish', () => {
      expect(buildLocaleUrl('es', '/en')).toBe('/');
    });

    it('strips /en/ and returns "/" for Spanish', () => {
      expect(buildLocaleUrl('es', '/en/')).toBe('/');
    });

    it('swaps /en/about to /de/about', () => {
      expect(buildLocaleUrl('de', '/en/about')).toBe('/de/about');
    });

    it('swaps /de/a/b/c to /it/a/b/c', () => {
      expect(buildLocaleUrl('it', '/de/a/b/c')).toBe('/it/a/b/c');
    });
  });

  describe('unprefixed path with target non-default locale', () => {
    it('prepends /zh to /about', () => {
      expect(buildLocaleUrl('zh', '/about')).toBe('/zh/about');
    });

    it('prepends /pt to /contact', () => {
      expect(buildLocaleUrl('pt', '/contact')).toBe('/pt/contact');
    });
  });
});

// ─── Component tests: LanguageSelector ───────────────────────────────────────

describe('LanguageSelector', () => {
  beforeEach(() => {
    // Reset location for each test — jsdom allows writable assignment
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: { pathname: '/', href: 'http://localhost/' },
    });
  });

  it('renders the selector button with default label', () => {
    render(<LanguageSelector />);
    expect(screen.getByRole('button', { name: /IDIOMA/i })).toBeInTheDocument();
  });

  it('renders the selector button with a custom label', () => {
    render(<LanguageSelector selectorLabel="LANGUAGE" />);
    expect(screen.getByRole('button', { name: /LANGUAGE/i })).toBeInTheDocument();
  });

  it('dropdown is closed by default', () => {
    render(<LanguageSelector />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens dropdown on button click', () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /IDIOMA/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes dropdown on second button click', () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /IDIOMA/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('lists all supported locales when open', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button', { name: /IDIOMA/i }));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6); // es, en, de, zh, pt, it
  });

  it('uses SSR-provided locale as initial active locale', () => {
    render(<LanguageSelector currentLocale="en" />);
    fireEvent.click(screen.getByRole('button', { name: /IDIOMA/i }));
    const enOption = screen.getByRole('option', { name: /EN/i });
    expect(enOption).toHaveAttribute('aria-selected', 'true');
  });

  it('button has correct aria-expanded when dropdown is open', () => {
    render(<LanguageSelector />);
    const button = screen.getByRole('button', { name: /IDIOMA/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('writes preferred-locale cookie when a locale option is selected', () => {
    // jsdom accumulates cookies via document.cookie natively — no spy needed.
    render(<LanguageSelector currentLocale="es" />);
    fireEvent.click(screen.getByRole('button', { name: /IDIOMA/i }));
    fireEvent.click(screen.getByRole('option', { name: /EN/i }));

    // jsdom's document.cookie getter returns only name=value pairs (strips attributes),
    // so we can assert on the raw cookie string that setLocaleCookie produced.
    expect(document.cookie).toContain('preferred-locale=en');
  });

  it('navigates to the correct locale URL when an option is selected', () => {
    // window.location.href is writable in jsdom (set in beforeEach)
    render(<LanguageSelector currentLocale="es" />);
    fireEvent.click(screen.getByRole('button', { name: /IDIOMA/i }));
    fireEvent.click(screen.getByRole('option', { name: /EN/i }));

    // After selecting English from root "/", href should target "/en/"
    expect(window.location.href).toBe('/en/');
  });

  it('closes the dropdown after a locale is selected', () => {
    render(<LanguageSelector currentLocale="es" />);
    fireEvent.click(screen.getByRole('button', { name: /IDIOMA/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: /EN/i }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
