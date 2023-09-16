import { getDirectCanisterUrl, getProxyCanisterUrl } from '../../url-builder';

describe('url-builder', () => {
  describe('getDirectCanisterUrl', () => {
    it('get mainnet direct canister url', () => {
      const expected = 'https://fghij-biaaa-aaaal-qbhwa-cai.icp0.io';
      const actual = getDirectCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', false, false);
      expect(actual).toEqual(expected);
    });

    it('get raw mainnet direct canister url', () => {
      const expected = 'https://fghij-biaaa-aaaal-qbhwa-cai.raw.icp0.io';
      const actual = getDirectCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', true, false);
      expect(actual).toEqual(expected);
    });

    it('get local direct canister url', () => {
      const expected = 'http://fghij-biaaa-aaaal-qbhwa-cai.localhost:8080';
      const actual = getDirectCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', false, true);
      expect(actual).toEqual(expected);
    });

    it('get raw local direct canister url', () => {
      // local canisters do not use raw
      const expected = 'http://fghij-biaaa-aaaal-qbhwa-cai.localhost:8080';
      const actual = getDirectCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', true, true);
      expect(actual).toEqual(expected);
    });
  });

  describe('getProxyCanisterUrl', () => {
    it('get mainnet proxy canister url', () => {
      const expected = 'https://prptl.io/-/fghij-biaaa-aaaal-qbhwa-cai';
      const actual = getProxyCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', false);
      expect(actual).toEqual(expected);
    });

    it('get local proxy canister url', () => {
      const expected = 'http://localhost:3000/-/fghij-biaaa-aaaal-qbhwa-cai';
      const actual = getProxyCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', true);
      expect(actual).toEqual(expected);
    });

    it('get local proxy canister url on specific port', () => {
      const expected = 'http://localhost:1234/-/fghij-biaaa-aaaal-qbhwa-cai';
      const actual = getProxyCanisterUrl('fghij-biaaa-aaaal-qbhwa-cai', true, 1234);
      expect(actual).toEqual(expected);
    });
  });
});
