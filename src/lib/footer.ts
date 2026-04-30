import type { UIKey } from '../i18n/ui';
import { getLocalizedPageHref, PAGE_ROUTE_ID, type PageRouteId } from './site-navigation';

export const FOOTER_LINK_KIND = {
  PAGE: 'page',
  EXTERNAL: 'external',
  EMAIL: 'email',
} as const;

export type FooterLinkKind = (typeof FOOTER_LINK_KIND)[keyof typeof FOOTER_LINK_KIND];

export const FOOTER_ICON_NAME = {
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  WHATSAPP: 'whatsapp',
  WECHAT: 'wechat',
} as const;

export type FooterIconName = (typeof FOOTER_ICON_NAME)[keyof typeof FOOTER_ICON_NAME];

export interface FooterNavigationItem {
  id: string;
  labelKey: UIKey;
  href?: string;
  kind: FooterLinkKind;
  routeId?: PageRouteId;
}

export interface FooterSocialItem {
  id: string;
  label: string;
  href: string;
  icon: FooterIconName;
  kind: FooterLinkKind;
}

export interface FooterContactData {
  email: string;
  href: string;
  kind: FooterLinkKind;
}

export interface FooterData {
  navigation: FooterNavigationItem[];
  social: FooterSocialItem[];
  contact: FooterContactData;
}

export const FOOTER_DATA: FooterData = {
  navigation: [
    {
      id: 'about',
      labelKey: 'nav.about',
      kind: FOOTER_LINK_KIND.PAGE,
      routeId: PAGE_ROUTE_ID.ABOUT,
    },
    {
      id: 'world',
      labelKey: 'nav.world',
      kind: FOOTER_LINK_KIND.PAGE,
      routeId: PAGE_ROUTE_ID.WORLD,
    },
    {
      id: 'franchise',
      labelKey: 'nav.franchise',
      href: '',
      kind: FOOTER_LINK_KIND.PAGE,
    },
    {
      id: 'newsroom',
      labelKey: 'nav.newsroom',
      kind: FOOTER_LINK_KIND.PAGE,
      routeId: PAGE_ROUTE_ID.NEWSROOM,
    },
    {
      id: 'privacy',
      labelKey: 'footer.privacy',
      href: '',
      kind: FOOTER_LINK_KIND.PAGE,
    },
  ],
  social: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: '',
      icon: FOOTER_ICON_NAME.LINKEDIN,
      kind: FOOTER_LINK_KIND.EXTERNAL,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: '',
      icon: FOOTER_ICON_NAME.INSTAGRAM,
      kind: FOOTER_LINK_KIND.EXTERNAL,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: '',
      icon: FOOTER_ICON_NAME.WHATSAPP,
      kind: FOOTER_LINK_KIND.EXTERNAL,
    },
    {
      id: 'wechat',
      label: 'WeChat',
      href: '',
      icon: FOOTER_ICON_NAME.WECHAT,
      kind: FOOTER_LINK_KIND.EXTERNAL,
    },
  ],
  contact: {
    email: 'aciummilano@acium.group',
    href: 'mailto:aciummilano@acium.group',
    kind: FOOTER_LINK_KIND.EMAIL,
  },
};

export function getFooterData(lang?: string | null) {
  return {
    ...FOOTER_DATA,
    navigation: FOOTER_DATA.navigation.map((item) => ({
      ...item,
      href: item.routeId ? getLocalizedPageHref(item.routeId, lang) : (item.href ?? ''),
    })),
  };
}
