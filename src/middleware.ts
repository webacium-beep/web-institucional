import { defineMiddleware } from "astro:middleware";

const supportedLocales = ["es", "en", "de", "zh", "pt", "it"];
const defaultLocale = "es";

const isAlreadyLocalized = (pathname: string) =>
  supportedLocales
    .filter((l) => l !== defaultLocale)
    .some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Dejar pasar assets, rutas ya localizadas y rutas internas
  if (
    pathname !== "/" ||
    isAlreadyLocalized(pathname) ||
    pathname.startsWith("/_") ||
    pathname.includes(".")
  ) {
    return next();
  }

  // Respetar elección previa guardada en cookie
  const savedLocale = context.cookies.get("preferred-locale")?.value;
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    if (savedLocale === defaultLocale) return next();
    return context.redirect(`/${savedLocale}/`, 302);
  }

  // Detectar idioma del navegador
  const acceptLanguage = context.request.headers.get("accept-language") ?? "";
  const detectedLocale = parseAcceptLanguage(acceptLanguage);

  // Guardar en cookie por 1 año
  context.cookies.set("preferred-locale", detectedLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  // Español → quedarse en "/", otros → redirigir
  if (detectedLocale === defaultLocale) return next();
  return context.redirect(`/${detectedLocale}/`, 302);
});

function parseAcceptLanguage(header: string): string {
  if (!header) return defaultLocale;

  const locales = header
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return {
        lang: lang.split("-")[0].toLowerCase(),
        priority: q ? parseFloat(q) : 1.0,
      };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const { lang } of locales) {
    if (supportedLocales.includes(lang)) {
      return lang;
    }
  }

  return defaultLocale;
}
