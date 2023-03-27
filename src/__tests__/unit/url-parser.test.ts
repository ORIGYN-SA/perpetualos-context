import { getPerpetualOSContext } from '../../index';
import { Actor, ActorSubclass } from '@dfinity/agent';
import { PhoneBook } from '../../phone-book';
import permutations from './url-parser.test.json';

describe('getPerpetualOSContext with all URL permutations', () => {
  beforeEach(() => {
    // Mock the lookup method of PhoneBook actor to return a valid response for a given collection ID
    const mockLookup = jest
      .fn()
      .mockResolvedValueOnce([[{ toText: () => 'fghij-biaaa-aaaal-qbhwa-cai' }]]);

    const actor = { lookup: mockLookup } as unknown as ActorSubclass<PhoneBook>;

    // Mock the createActor function to return the above actor
    jest.spyOn(Actor, 'createActor').mockReturnValueOnce(actor);
  });

  for (const { url, expectedResult } of permutations) {
    it(`returns valid context for URL: ${url}`, async () => {
      const actual = await getPerpetualOSContext(url);
      expect(actual).toStrictEqual(expectedResult);
    });
  }
});
