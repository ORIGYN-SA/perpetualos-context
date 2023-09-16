import { Actor, ActorSubclass } from '@dfinity/agent';
import { PhoneBook, lookupCanisterId, lookupCollectionId } from '../../phone-book';

describe('Phone Book', () => {
  describe('lookupCanisterId', () => {
    it('returns the corresponding canister ID principal as a string for a valid collection ID', async () => {
      // Mock the lookup method of PhoneBook actor to return a valid response for a given collection ID
      const mockLookup = jest
        .fn()
        .mockResolvedValueOnce([[{ toText: () => 'abcde-biaaa-aaaal-qbhwa-cai' }]]);

      const actor = { lookup: mockLookup } as unknown as ActorSubclass<PhoneBook>;

      // Mock the createActor function to return the above actor
      jest.spyOn(Actor, 'createActor').mockReturnValueOnce(actor);

      const canisterId = await lookupCanisterId('my-cool-collection');

      expect(canisterId).toBe('abcde-biaaa-aaaal-qbhwa-cai');
      expect(mockLookup).toHaveBeenCalledWith('my-cool-collection');
    });

    it('returns an empty string for an invalid collection ID', async () => {
      // Mock the lookup method of PhoneBook actor to return an empty response for an invalid collection ID
      const mockLookup = jest.fn().mockResolvedValueOnce([]);
      const actor = { lookup: mockLookup } as unknown as ActorSubclass<PhoneBook>;

      // Mock the createActor function to return the above actor
      jest.spyOn(Actor, 'createActor').mockReturnValueOnce(actor);

      const canisterId = await lookupCanisterId('invalid-collection-id');

      expect(canisterId).toBe('');
      expect(mockLookup).toHaveBeenCalledWith('invalid-collection-id');
    });
  });

  describe('lookupCollectionId', () => {
    it('returns the corresponding collection ID for a valid nft canister ID', async () => {
      // Mock the reverse_lookup method of PhoneBook actor to return a valid response for a given collection ID
      const mockReverseLookup = jest.fn().mockResolvedValueOnce('my-cool-collection');

      const actor = { reverse_lookup: mockReverseLookup } as unknown as ActorSubclass<PhoneBook>;

      // Mock the createActor function to return the above actor
      jest.spyOn(Actor, 'createActor').mockReturnValueOnce(actor);

      const collectionId = await lookupCollectionId('qhbym-qaaaa-aaaaa-aaafq-cai');

      expect(collectionId).toBe('my-cool-collection');
    });

    it('returns an empty string for an invalid canister ID', async () => {
      // Mock the reverse_lookup method of PhoneBook actor to return an empty response for an invalid collection ID
      const mockReverseLookup = jest.fn().mockResolvedValueOnce('');

      const actor = { reverse_lookup: mockReverseLookup } as unknown as ActorSubclass<PhoneBook>;

      // Mock the createActor function to return the above actor
      jest.spyOn(Actor, 'createActor').mockReturnValueOnce(actor);

      const collectionId = await lookupCollectionId('qhbym-qaaaa-aaaaa-aaafq-cai');

      expect(collectionId).toBe('');
    });
  });
});
