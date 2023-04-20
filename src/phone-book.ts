import { Actor, ActorMethod, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import nodeFetch from 'node-fetch';

declare global {
  interface Window {
    fetch: any;
  }
}

/**
 * The canister ID of the ORIGYN `Phone Book` on the Internet Computer mainnet network.
 * There is only a single instance of the `Phone Book`
 */
export const PHONE_BOOK_CANISTER_ID = 'ngrpb-5qaaa-aaaaj-adz7a-cai';

/**
 * Partial IDL (Interface Definition Language) of the ORIGYN `Phone Book` canister
 */
const phoneBookIdl = ({ IDL }) => {
  return IDL.Service({
    lookup: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(IDL.Principal))], ['query']),
    reverse_lookup: IDL.Func([IDL.Principal], [IDL.Text], ['query']),
    list: IDL.Func(
      [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal)))],
      [],
    ),
  });
};

const MAINNET_BOUNDARY_NODE = 'https://boundary.ic0.app/';

/**
 * Partial interface of the ORIGYN Phone Book canister
 */
export interface PhoneBook {
  lookup: ActorMethod<[string], [] | [Principal[]]>;
  reverse_lookup: ActorMethod<[Principal], string>;
  list: ActorMethod<[[] | [bigint], [] | [bigint]], Array<[string, Principal[]]>>;
}

/**
 * Queries the ORIGYN `Phone Book` canister to get the canister ID that corresponds to
 * the provided collection ID.
 *
 * The `Phone Book` contains a registry of collection IDs and their corresponding
 * canister IDs.
 *
 * Example:
 * - https://prptl.io/-/my-cool-collection/
 *   - The collection ID in this URL is `my-cool-collection`
 *   - The canister ID may be `abcde-biaaa-aaaal-qbhwa-cai`
 *
 * @param collectionId - a user friendly like `my-cool-collection`
 * @returns the corresponding canister ID principal as a string
 */
export const lookupCanisterId = async (collectionId: string): Promise<string> => {
  const actor = Actor.createActor<PhoneBook>(phoneBookIdl, {
    agent: new HttpAgent({
      fetch: typeof window !== 'undefined' ? window.fetch : nodeFetch,
      host: MAINNET_BOUNDARY_NODE,
    }),
    canisterId: PHONE_BOOK_CANISTER_ID,
  });

  const res = await actor.lookup(collectionId);
  return res?.[0]?.[0]?.toText() || '';
};

/**
 * Queries the ORIGYN `Phone Book` canister to get the collection ID that corresponds to
 * the provided canister ID.
 *
 * The `Phone Book` contains a registry of collection IDs and their corresponding
 * canister IDs.
 *
 * Example:
 * - https://prptl.io/-/abcde-biaaa-aaaal-qbhwa-cai/
 *   - The canister ID in this URL is `abcde-biaaa-aaaal-qbhwa-cai`
 *   - The collection ID may be `my-cool-collection
 *
 * @param canisterId - a valid Internet Computer canister ID `like abcde-biaaa-aaaal-qbhwa-cai`
 * @returns the corresponding collection ID
 */
export const lookupCollectionId = async (canisterId: string): Promise<string> => {
  const actor = Actor.createActor<PhoneBook>(phoneBookIdl, {
    agent: new HttpAgent({
      fetch: typeof window !== 'undefined' ? window.fetch : nodeFetch,
      host: MAINNET_BOUNDARY_NODE,
    }),
    canisterId: PHONE_BOOK_CANISTER_ID,
  });

  const collectionId = await actor.reverse_lookup(Principal.fromText(canisterId));
  return collectionId;
};
