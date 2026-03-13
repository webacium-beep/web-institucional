import { useState, useEffect, useRef } from "react";

const LOCALES = [
  { code: "es", flag: "🇪🇸", label: "ES", name: "Español" },
  { code: "en", flag: "🇬🇧", label: "EN", name: "English" },
  { code: "de", flag: "🇩🇪", label: "DE", name: "Deutsch" },
  { code: "zh", flag: "🇨🇳", label: "ZH", name: "中文" },
  { code: "pt", flag: "🇧🇷", label: "PT", name: "Português" },
  { code: "it", flag: "🇮🇹", label: "IT", name: "Italiano" },
];

const DEFAULT_LOCALE = "es";
const COOKIE_NAME = "preferred-locale";

function getCurrentLocale(): string {
  const path = window.location.pathname;
  const match = path.match(/^\/(en|de|zh|pt|it)(\/|$)/);
  return match ? match[1] : DEFAULT_LOCALE;
}

function setLocaleCookie(code: string) {
  document.cookie = `${COOKIE_NAME}=${code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
}

export default function LanguageSelector() {
  const [current, setCurrent] = useState(DEFAULT_LOCALE);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(getCurrentLocale());
  }, []);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function changeLanguage(code: string) {
    setLocaleCookie(code);
    setCurrent(code);
    setOpen(false);

    const destination = code === DEFAULT_LOCALE ? "/" : `/${code}/`;
    window.location.href = destination;
  }

  const active = LOCALES.find((l) => l.code === current) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative inline-block">
      {/* Botón */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-800 dark:text-gray-100 min-w-[80px] justify-between"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span className="tracking-wide">{active.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-10 top-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden z-50 min-w-[152px] shadow-sm"
        >
          {LOCALES.map((locale) => (
            <li
              key={locale.code}
              role="option"
              aria-selected={locale.code === current}
              onClick={() => changeLanguage(locale.code)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0
                ${locale.code === current
                  ? "bg-gray-50 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              <span className="text-base leading-none">{locale.flag}</span>
              <span className="flex-1 text-gray-800 dark:text-gray-100">{locale.name}</span>
              {locale.code === current && (
                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8l3.5 3.5L13 4.5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}