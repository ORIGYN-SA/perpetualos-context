import { lookupCanisterId } from '../../phone-book';

describe('lookupCanisterId integration test', () => {
  it('returns the corresponding canister ID principal as a string for a valid collection ID', async () => {
    const canisterId = await lookupCanisterId('brain-matters-dev');
    expect(canisterId).toBe('mludz-biaaa-aaaal-qbhwa-cai');
  });

  it('returns an empty string for an invalid collection ID', async () => {
    const canisterId = await lookupCanisterId('does-not-exist');
    expect(canisterId).toBe('');
  });
});
