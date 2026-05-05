import { describe, expect, it } from 'vitest';

import { franchiseContacts, getFranchiseContactByCountryCode } from './franchise-contacts';
import { franchiseMarketInfo } from '../i18n/franchise-market-info';

describe('franchiseContacts', () => {
  it('contains one row per market from the spreadsheet screenshots', () => {
    expect(franchiseContacts).toHaveLength(24);
  });

  it('uses unique country codes', () => {
    const countryCodes = franchiseContacts.map((row) => row.countryCode);
    expect(new Set(countryCodes).size).toBe(countryCodes.length);
  });

  it('references valid franchise market info keys', () => {
    for (const row of franchiseContacts) {
      expect(franchiseMarketInfo.es[row.masterInfoKey]).toBeTruthy();
    }
  });

  it('returns a row by country code', () => {
    expect(getFranchiseContactByCountryCode('CO')?.email).toBe('sara.quintero@acium.global');
    expect(getFranchiseContactByCountryCode('JP')?.dialCode).toBe('+81');
    expect(getFranchiseContactByCountryCode('XX')).toBeNull();
  });

  it('builds WhatsApp links for rows that have a WhatsApp number', () => {
    expect(getFranchiseContactByCountryCode('PY')?.whatsappLink).toBe('https://wa.me/573046825050');
    expect(getFranchiseContactByCountryCode('FR')?.whatsappLink).toBe('https://wa.me/573046825050');
    expect(getFranchiseContactByCountryCode('CO')?.whatsappLink).toBe('https://wa.me/573154075163');
  });
});
