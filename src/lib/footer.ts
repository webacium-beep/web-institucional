import type { UIKey } from '../i18n/ui';

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
  href: string;
  kind: FooterLinkKind;
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
      href: '',
      kind: FOOTER_LINK_KIND.PAGE,
    },
    {
      id: 'world',
      labelKey: 'nav.world',
      href: '',
      kind: FOOTER_LINK_KIND.PAGE,
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
      href: '',
      kind: FOOTER_LINK_KIND.PAGE,
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

export function getFooterData() {
  return FOOTER_DATA;
}
