import { describe, expect, it } from 'vitest';

import { franchiseMarketInfo, type FranchiseMarketInfoContent } from './franchise-market-info';

const locales = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

const franchiseMarketInfoKeys = [
  'franchiseMarketInfo.unitedStates',
  'franchiseMarketInfo.mexico',
  'franchiseMarketInfo.costaRica',
  'franchiseMarketInfo.panama',
  'franchiseMarketInfo.ecuador',
  'franchiseMarketInfo.colombia',
  'franchiseMarketInfo.brazil',
  'franchiseMarketInfo.argentina',
  'franchiseMarketInfo.futureMarkets',
  'franchiseMarketInfo.portugal',
  'franchiseMarketInfo.uk',
  'franchiseMarketInfo.germany',
  'franchiseMarketInfo.spain',
  'franchiseMarketInfo.china',
  'franchiseMarketInfo.malaysia',
] as const satisfies readonly (keyof FranchiseMarketInfoContent)[];

describe('franchise-market-info i18n dictionary', () => {
  it('exports a FranchiseMarketInfoContent shape with all expected keys', () => {
    const content: FranchiseMarketInfoContent = franchiseMarketInfo.es;
    expect(Object.keys(content)).toHaveLength(franchiseMarketInfoKeys.length);
    expect(Object.keys(content).sort()).toEqual([...franchiseMarketInfoKeys].sort());
  });

  it('defines all supported locales', () => {
    for (const locale of locales) {
      expect(franchiseMarketInfo).toHaveProperty(locale);
    }
  });

  it('uses non-empty strings for every locale and key', () => {
    for (const locale of locales) {
      for (const key of franchiseMarketInfoKeys) {
        expect(franchiseMarketInfo[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });
});
