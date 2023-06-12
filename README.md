# ORIGYN PerpetualOS Context Library

Parses ORIGYN PerpetualOS URLs which access resources in an Internet Computer canister implementing the [ORIGYN NFT Standard](https://github.com/ORIGYN-SA/origyn_nft/blob/main/docs/specification.md).

For an overview of the PerpetualOS see [Welcome to the PerpetualOS](https://medium.com/@ORIGYN-Foundation/welcome-to-the-perpetualos-188d1d195784).

## 🏁 Quickstart

```
npm install @origyn/perpetualos-context
```

```
import { getPerpetualOSContext } from '@origyn/perpetualos-context';

const context = getPerpetualOSContext('https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/-/epithalamus-amygdala-diencephalon/primary');

console.log('context', context);
```

## Build

```
npm ci
npm run build
```

## PerpetualOS Context

`PerpetualOS Context` is created by parsing the PerpetualOS URL. It provides information
about the canister, collection, token, library asset or other resource being requested by the URL.

### Context Object

See the `URLContext` interface comments in [types.ts](src/types.ts).

### Canister References:

A `canister reference` is the first part of the PerpetualOS URL that references a canister.

The following URLs are validated and parsed using the `DirectCanisterUrl` and `ProxyCanisterUrl`
regular expressions in [regex-patterns.ts](src/regex-patterns.ts).

- Direct to Canister
  - Localhost
    - Direct to local canister
      - http://{canister_id}.localhost:8080
    - Webpack dev server to local canister
      - http://localhost:8081/-/{canister_id}
  - Mainnet
    - Canisters created before Apr 20, 2023
      - https://{canister_id}.raw.ic0.app
      - https://{canister_id}.ic0.app
    - Canisters created before or after Apr 20, 2023
      - https://{canister_id}.raw.icp0.io
      - https://{canister_id}.icp0.io
    - Webpack dev server to mainnet canister
      - http://localhost:9000/-/{canister_id}
- Via Proxy
  - Localhost (uses local proxy)
    - http://localhost:3000/-/{canister_id}
  - Webpack dev server to Mainnet Canister (uses mainnet proxy)
    - http://localhost:9000/-/{canister_id}
  - Mainnet
    - Current domain
      - https://prptl.io/-/{canister_id}
    - Legacy domain
      - https://exos.origyn.network/-/{canister_id}
- Via Proxy + Phonebook (to Lookup Collection ID)
  - Localhost
    - http://localhost:3000/-/{collection_id} (lookup canister_id from collection_id)
  - Webpack dev server to Mainnet Canister (uses mainnet proxy)
    - http://localhost:9000/-/{collection_id} (lookup canister_id from collection_id)
  - Mainnet
    - Current domain
      - https://prptl.io/-/{collection_id} (lookup canister_id from collection_id)
    - Legacy domain
      - https://exos.origyn.network/-/{collection_id} (lookup canister_id from collection_id)

### Canister-Relative Path (PerpetualOS URL Paths):

A `canister-relative path` in this project refers to the part of the URL after the canister reference,
but not including the query string or fragment (if provided).

This part of the URL specifies the resource that is being requested from the canister.

This is similar to a root-relative URL, but since canister references can either be a root-URL (direct to canister),
or a root-URL with 2 additional segments (prptl.io domain with reverse proxy), we need a different term for
this path following the canister reference.

For a list of all canister-relative paths, see the `ResourceType` enum comments in [types.ts](src/types.ts).

Note that hyphens in URLs are placeholders for future data and are currently ignored.

### Examples

- canister_id: abcde-biaaa-aaaal-qbhwa-cai
- collection_id: brain-matters-dev (lookup function with that name returns canister_id abcde-biaaa-aaaal-qbhwa-cai)
- token_id: epithalamus-amygdala-diencephalon
- URL to the collection's preview image: https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/collection/preview
- URL to the marketplace dApp at the collection level: https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/collection/-/marketplace#/epithalamus-amygdala-diencephalon
- URL to the marketplace dApp at the token level: https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/-/epithalamus-amygdala-diencephalon/-/marketplace#/thalamus-neocortex-brainstem
- URL to an experience page: https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/-/epithalamus-amygdala-diencephalon/ex
- URL to a primary asset: https://abcde-biaaa-aaaal-qbhwa-cai.raw.ic0.app/-/epithalamus-amygdala-diencephalon/primary

Note: The ORIGYN `Phone Book` canister maps collection IDs to canister IDs.
