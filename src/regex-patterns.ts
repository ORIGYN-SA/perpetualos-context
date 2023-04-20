/**
 * Contains Regular Expressions for parsing PerpetualOS URLs.
 */
export const PATTERNS = {
  /**
   * Matches a canister ID principal string.
   *
   * Example:
   * matches[0] abcde-biaaa-aaaal-qbhwa-cai
   */
  CanisterId: /(?:[a-z0-9]{5}-){4}[a-z0-9]{3}/i,

  /**
   * Matches the following URL formats:
   * - https://{canister_id}.raw.icp0.io/...
   * - https://{canister_id}.icp0.io/...
   * - https://{canister_id}.raw.ic0.app/...
   * - https://{canister_id}.ic0.app/...
   * - http://{canister_id}.localhost:8000/...
   *
   * Example matches:
   * - https://abcde-biaaa-aaaal-qbhwa-cai.raw.icp0.io
   *   - matches.groups.id abcde-biaaa-aaaal-qbhwa-cai
   *   - matches.groups.domain raw.icp0.io
   * - https://abcde-biaaa-aaaal-qbhwa-cai.localhost:8000
   *   - matches.groups.id abcde-biaaa-aaaal-qbhwa-cai
   *   - matches.groups.domain localhost:8000
   *
   * Notes:
   * - The id should be a canister ID.
   *   - Test it with the CanisterId pattern.
   *   - If it's not a canister ID, it's invalid.
   */
  DirectCanisterUrl:
    /https?:\/\/(?<id>[^\.]*)\.(?<domain>(?:(?:raw\.)?(?:ic0\.app|icp0\.io))|(?:localhost:\d+))/i,

  /**
   * Matches the following URL formats:
   * - http://localhost:3000/-/{canister_id}/...
   * - https://prptl.io/-/{canister_id}/...
   * - https://exos.origyn.network/-/{canister_id}/...
   * - http://localhost:3000/-/{canister_name}/...
   * - https://prptl.io/-/{canister_name}/...
   * - https://exos.origyn.network/-/{canister_name}/...
   *
   * Example matches:
   * - http://prptl.io/-/abcde-biaaa-aaaal-qbhwa-cai
   *   - matches.groups.domain: prptl.io
   *   - matches.groups.id: abcde-biaaa-aaaal-qbhwa-cai
   * - http://localhost:3000/-/brain-matters
   *   - matches.groups.domain: localhost:3000
   *   - matches.groups.id: brain-matters
   *
   * Note:
   * - The id is either the canister ID or the collection ID (registered in the phone book canister)
   *   - First, test it with the `CanisterId` pattern.
   *   - If it's not a canister ID, look up the collection ID in the phone book to get the canister ID.
   *   - If the collection ID is not found in the phone book, it's invalid.
   */
  ProxyCanisterUrl:
    /https?:\/\/(?<domain>(?:prptl\.io)|(?:exos\.origyn\.network)|(?:localhost:\d+))\/-\/(?<id>[^\/\?#]*)/i,

  /**
   * Matches the following canister-relative URL formats:
   * - /collection
   * - /collection/info
   * - /collection/-/library-asset.png
   *
   * Example matches:
   * - /collection
   *   - matches.groups.known: undefined
   *   - matches.groups.asset: undefined
   * - /collection/info
   *   - matches.groups.known: info
   *   - matches.groups.asset: undefined
   * - /collection/-/library-asset.png
   *   - matches.groups.known: undefined
   *   - matches.groups.asset: library-asset.png
   */
  CollectionRelativeUrl: /\/collection(?:\/(?:(?:-\/(?<asset>[^\/\?#]*))|(?<known>[^\/\?#]*)))?/i,

  /**
   * Matches the following canister-relative URL formats:
   * - /-/token-1
   * - /-/token-1/info
   * - /-/token-1/-/library-asset.png
   *
   * Example matches:
   * - /-/token-1
   *   - matches.groups.token: token-1
   *   - matches.groups.known: undefined
   *   - matches.groups.asset: undefined
   * - /-/token-1/info
   *   - matches.groups.token: token-1
   *   - matches.groups.known: info
   *   - matches.groups.asset: undefined
   * - /-/token-1/-/library-asset.png
   *   - matches.groups.token: token-1
   *   - matches.groups.known: undefined
   *   - matches.groups.asset: library-asset.png
   */
  TokenRelativeUrl:
    /\/-\/(?<token>[^\/\?#]*)(?:\/(?:(?:-\/(?<asset>[^\/\?#]*))|(?<known>[^\/\?#]*)))?/i,
};
