import { normalizeLocale } from '../i18n/utils';
import type { Locales } from '../i18n/ui';

export const PAGE_ROUTE_ID = {
  HOME: 'home',
  ABOUT: 'about',
  WORLD: 'world',
  NEWSROOM: 'newsroom',
} as const;

export type PageRouteId = (typeof PAGE_ROUTE_ID)[keyof typeof PAGE_ROUTE_ID];

export function getLocalizedPageHref(page: PageRouteId, lang: string | null | undefined): string {
  const safeLang: Locales = normalizeLocale(lang);

  if (page === PAGE_ROUTE_ID.HOME) {
    return safeLang === 'es' ? '/#site-top' : `/${safeLang}#site-top`;
  }

  if (page === PAGE_ROUTE_ID.ABOUT) {
    return safeLang === 'es' ? '/about' : `/${safeLang}/about`;
  }

  if (page === PAGE_ROUTE_ID.WORLD) {
    return safeLang === 'es' ? '/world' : `/${safeLang}/world`;
  }

  if (page === PAGE_ROUTE_ID.NEWSROOM) {
    return safeLang === 'es' ? '/newsroom' : `/${safeLang}/newsroom`;
  }

  return '/';
}
