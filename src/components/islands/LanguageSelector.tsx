import { useState, useEffect, useRef } from "react";

// Display code overrides: canonical locale → visual label
const DISPLAY_CODE: Record<string, string> = {
  de: "GE",
  zh: "CH",
};

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "de", label: "GE" },
  { code: "zh", label: "CH" },
  { code: "pt", label: "PT" },
  { code: "it", label: "IT" },
] as const;

const DEFAULT_LOCALE = "es";
const COOKIE_NAME = "preferred-locale";

// Supported non-es locale prefixes (must match middleware + Astro i18n config)
const PREFIXED_LOCALES = ["en", "de", "zh", "pt", "it"];

function getCurrentLocale(): string {
  const path = window.location.pathname;
  const match = path.match(/^\/(en|de|zh|pt|it)(\/|$)/);
  return match ? match[1] : DEFAULT_LOCALE;
}

function setLocaleCookie(code: string) {
  document.cookie = `${COOKIE_NAME}=${code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
}

/**
 * Transforms the current pathname into a destination pathname for the target locale.
 *
 * Algorithm:
 * 1. Strip any existing locale prefix (en|de|zh|pt|it) from the path.
 * 2. If target is 'es', return the stripped (unprefixed) path.
 * 3. Otherwise, prepend /{targetLocale} to the stripped path.
 *
 * Edge cases:
 *   "/"          → es: "/"    | en: "/en/"
 *   "/en"        → es: "/"    | de: "/de/"
 *   "/en/"       → es: "/"    | zh: "/zh/"
 *   "/en/about"  → es: "/about" | pt: "/pt/about"
 *   "/de/a/b/c"  → es: "/a/b/c" | it: "/it/a/b/c"
 */
export function buildLocaleUrl(targetLocale: string, pathname: string): string {
  const prefixPattern = new RegExp(`^\\/(${PREFIXED_LOCALES.join("|")})(\\/?)`);
  const match = pathname.match(prefixPattern);

  // Strip existing locale prefix; normalize to '/' if the result is empty
  let pathWithoutLocale: string;
  if (match) {
    // match[0] is the full prefix (e.g. "/en" or "/en/")
    // Remainder is everything after the prefix
    const remainder = pathname.slice(match[0].length);
    pathWithoutLocale = remainder ? `/${remainder}` : "/";
  } else {
    pathWithoutLocale = pathname || "/";
  }

  if (targetLocale === DEFAULT_LOCALE) {
    return pathWithoutLocale;
  }

  // Construct prefixed URL:
  // - Root path ("/") → "/{locale}/" (trailing slash for root)
  // - Non-root path ("/about") → "/{locale}/about" (no trailing slash added)
  if (pathWithoutLocale === "/") {
    return `/${targetLocale}/`;
  }
  return `/${targetLocale}${pathWithoutLocale}`;
}

interface Props {
  /** SSR-resolved locale from Header.astro; fallback to client-side detection if undefined */
  currentLocale?: string;
  /** Translated label for the selector button (e.g. "IDIOMA", "LANGUAGE") */
  selectorLabel?: string;
}

export default function LanguageSelector({ currentLocale, selectorLabel = "IDIOMA" }: Props) {
  // Seed state from SSR prop to prevent hydration flash; fall back to client detection
  const [current, setCurrent] = useState(currentLocale ?? DEFAULT_LOCALE);
  const [open, setOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // If the SSR prop was provided, trust it; otherwise re-derive from URL client-side.
    if (!currentLocale) {
      setCurrent(getCurrentLocale());
    }
  }, [currentLocale]);

  // Click-away listener — closes dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle() {
    if (!open && triggerRef.current) {
      // Check if dropdown would overflow viewport bottom
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownEstimatedHeight = LOCALES.length * 40;
      if (rect.bottom + dropdownEstimatedHeight > window.innerHeight) {
        setFlipUp(true);
      } else {
        setFlipUp(false);
      }
    }
    setOpen((v) => !v);
  }

  function changeLanguage(code: string) {
    // Write cookie BEFORE navigation so middleware sees it on next root request
    setLocaleCookie(code);
    setCurrent(code);
    setOpen(false);
    const destination = buildLocaleUrl(code, window.location.pathname);
    window.location.href = destination;
  }

  const displayLabel = (code: string) => DISPLAY_CODE[code] ?? code.toUpperCase();
  const buttonLabel = `${selectorLabel} ▼`;

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger button — ghost span prevents CLS on weight change */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="relative inline-flex flex-col items-center text-[#9B9B9B] hover:text-white font-[300] hover:font-[800] cursor-pointer transition-none text-[13px] tracking-[0.18em] bg-transparent border-none outline-none"
      >
        {buttonLabel}
        {/* Ghost span at font-800 pre-reserves the bold width — prevents CLS */}
        <span
          aria-hidden="true"
          className="lang-ghost font-[800] h-0 overflow-hidden invisible block pointer-events-none select-none"
        >
          {buttonLabel}
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul
          role="listbox"
          className={`absolute ${flipUp ? "bottom-full mb-1" : "top-full mt-1"} right-0 bg-white text-black z-50 min-w-[64px] shadow-sm`}
        >
          {LOCALES.map((locale) => {
            const isActive = locale.code === current;
            return (
              <li
                key={locale.code}
                role="option"
                aria-selected={isActive}
                onClick={() => changeLanguage(locale.code)}
                className={`group px-4 py-2 cursor-pointer text-[13px] tracking-[0.18em] transition-none ${
                  isActive ? "font-[800]" : "font-[300] hover:font-[800]"
                }`}
              >
                {displayLabel(locale.code)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
