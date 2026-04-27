import { describe, expect, it } from 'vitest';

import { FOOTER_DATA, FOOTER_ICON_NAME, FOOTER_LINK_KIND, getFooterData } from './footer';

describe('FOOTER_DATA', () => {
  it('reuses existing nav translation keys for core navigation items', () => {
    expect(FOOTER_DATA.navigation).toEqual([
      expect.objectContaining({ labelKey: 'nav.about' }),
      expect.objectContaining({ labelKey: 'nav.world' }),
      expect.objectContaining({ labelKey: 'nav.franchise' }),
      expect.objectContaining({ labelKey: 'nav.newsroom' }),
      expect.objectContaining({ labelKey: 'footer.privacy' }),
    ]);
  });

  it('marks page navigation items as page links', () => {
    FOOTER_DATA.navigation.forEach(item => {
      expect(item.kind).toBe(FOOTER_LINK_KIND.PAGE);
    });
  });

  it('marks social entries as external links with known icons', () => {
    FOOTER_DATA.social.forEach(item => {
      expect(item.kind).toBe(FOOTER_LINK_KIND.EXTERNAL);
      expect(Object.values(FOOTER_ICON_NAME)).toContain(item.icon);
    });
  });

  it('uses wechat as the fourth social platform to match available assets', () => {
    expect(FOOTER_DATA.social).toContainEqual(
      expect.objectContaining({
        id: 'wechat',
        label: 'WeChat',
        icon: FOOTER_ICON_NAME.WECHAT,
      }),
    );
  });

  it('exposes the shared contact email as a mailto link', () => {
    expect(FOOTER_DATA.contact.email).toBe('aciummilano@acium.group');
    expect(FOOTER_DATA.contact.href).toBe('mailto:aciummilano@acium.group');
    expect(FOOTER_DATA.contact.kind).toBe(FOOTER_LINK_KIND.EMAIL);
  });
});

describe('getFooterData', () => {
  it('returns the canonical footer data object', () => {
    expect(getFooterData()).toBe(FOOTER_DATA);
  });
});
