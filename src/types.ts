/**
 * An object containing the name and value of a query string parameter
 * from a URL's query string.
 */
export interface QueryStringParam {
  name: string;
  value: string;
}

export enum ResourceLevel {
  /**
   * Default value: resource level could not be determined.
   */
  Unknown,

  /**
   * The resource requested by a URL applies to the entire collection, not a specific token.
   */
  Collection,

  /**
   * The resource requested by a URL applies only to a specific token.
   */
  Token,
}

export enum ResourceType {
  /**
   * Default value: resource type could not be determined
   */
  Unknown,

  /**
   * Description:
   * - JSON array of all token IDs in the collection
   *
   * Path:
   * - /collection
   */
  Collection,

  /**
   * Description:
   * - JSON object containing general information about the collection or token
   *
   * Paths:
   * - /collection/info
   * - /-/{token_id}/info
   */
  Info,

  /**
   * Description:
   * - JSON array of all ledger transactions for the collection or token
   * - Note: This is an internal ledger of digital certificate sales.
   *   - OGY transactions are tracked in a separate OGY ledger canister.
   *
   * Paths:
   * - /collection/ledger_info
   * - /-/{token_id}/ledger_info
   */
  LedgerInfo,

  /**
   * Description:
   * - JSON array of objects (for collection) or single object (for a token) containing
   * the token ID in the collection and the corresponding token IDs for the "ext" and
   * "dip721" standards
   *
   * Paths:
   * - /collection/translate
   * - /-/{token_id}/translate
   */
  Translate,

  /**
   * Description:
   * - JSON array of all library assets in the collection or token
   * - A library is a list of assets in the collection or token (uploaded
   * files or URLs to external web resources)
   *
   * Paths:
   * - /collection/library
   * - /-/{token_id}/library
   */
  Library,

  /**
   * Description:
   * - Shortcut to a library asset designated as the primary asset of a
   * collection or token.
   *
   * Paths:
   * - /collection/primary
   * - /-/{token_id}/-/primary
   */
  PrimaryAsset,

  /**
   * Description:
   * - Shortcut to a library asset designated as the preview asset of a
   * collection or token.
   *
   * Paths:
   * - /collection/preview
   * - /-/{token_id}/-/preview
   */
  PreviewAsset,

  /**
   * Description:
   * - Shortcut to a library asset designated as the hidden asset of a
   * collection or token.
   *
   * Paths:
   * - /collection/hidden
   * - /-/{token_id}/-/hidden
   */
  HiddenAsset,

  /**
   * Description:
   * - Shortcut to a library asset designated as the experience asset of a
   * collection or token.
   * - This may be an HTML page, a video, or another asset providing a default
   * user experience.
   *
   * Paths:
   * - /collection/ex
   * - /-/{token_id}/-/ex
   */
  ExperienceAsset,

  /**
   * Description:
   * - A specific library asset in the collection or token library
   * - A library asset can be any file uploaded to the canister (including an
   * html file that serves a dapp), or a URL to an external web resource.
   *
   * Paths:
   * - /collection/-/{library_id}
   * - /-/{token_id}/-/{library_id}
   */
  LibraryAsset,
}

export interface URLContext {
  /**
   * The complete original URL that was parsed.
   */
  fullUrl: string;

  /**
   * Root-url or pseudo-root URL that references the canister
   */
  canisterUrl: string;

  /**
   * Root-url or pseudo-root URL that references the canister directly with the canister ID.
   * This may be the same as the canisterUrl if the URL is targeting a canister directly.
   */
  directCanisterUrl: string;

  /**
   * Same as the `directCanisterUrl` if `isDevServer` equals `true`, otherwise, `canisterUrl`.
   * Note: When hosting a dApp with webpack dev server, asset URLs that use the same port as the dev server
   * will return the entire dApp, resulting in broken images and other links. In this specific case, the
   * direct canister URL must be used to retrieve assets correctly.
   */
  assetCanisterUrl: string;

  /**
   * The port number of the canister URL if specified.
   */
  port: string;

  /**
   * Principal ID of the canister as a string
   */
  canisterId: string;

  /**
   * Collection ID as registered in the ORIGYN Phone Book canister,
   * if used in place of the canister ID. The phone book maps
   * collection IDs (friendly names) to canister IDs (principals).
   */
  collectionId: string;

  /**
   * The part of the URL after the canisterUrl.
   * This is similar to a root-relative URL, except that it starts after
   * the part of the URL that references the canister, which may be
   * a root URL or a pseudo root URL.
   */
  canisterRelativeUrl: string;

  /**
   * The canisterRelativeUrl without the hash or query string.
   * It may be equal to the canisterRelativeUrl if the URL does not contain
   * a hash or query string.
   */
  canisterRelativePath: string;

  /**
   * An array of objects containing the name and value of each query string
   * parameter.
   */
  queryStringParams: QueryStringParam[];

  /**
   * The part of the URL following the '#' character used to reference a
   * specific location in an HTML page
   */
  fragment: string;

  /**
   * Indicates that the URL is targeting a canister running on localhost.
   * If false, the URL is targeting a canister running on the Internet Computer
   * mainnet network.
   */
  isLocal: boolean;

  /**
   * Indicates that the URL is local, but targeting a canister running on the Internet Computer.
   * This is true when the port is 8080.
   * The Origyn DApps run locally on port 8080 (ex: `npm run start:marketplace`) while targeting
   * a mainnet canister.
   */
  isDevServer: boolean;

  /**
   * Indicates that the URL is referencing a canister directly.
   * If false, the URL is using the prptl.io (or legacy exos.origyn.network)
   * domain which goes through a reverse-proxy to request canister resources.
   */
  isDirect: boolean;

  /**
   * Indicates that the URL requesting a resource in the raw format
   * (.raw.ic0.app or .raw.icp0.io). These URLs bypass the process of
   * certifying data returned by the canister via a service worker.
   */
  isRaw: boolean;

  /**
   * The level in the resource hierarchy that contains the resource being requested by the URL:
   * - Collection
   *   - Token
   */
  resourceLevel: ResourceLevel;

  /**
   * The text representation of the ResourceLevel enum value.
   */
  resourceLevelText: string;

  /**
   * The type of the resource being requested by the URL.
   * The `ResourceType` depends on the `ResourceLevel` to provide the full context.
   */
  resourceType: ResourceType;

  /**
   * The text representation of the ResourceType enum value.
   */
  resourceTypeText: string;
  /**
   * The ID of the token (if specified) containing the resource requested by the URL
   */
  tokenId: string;

  /**
   * The ID of the library asset requested by the URL
   */
  libraryId: string;
}
