import { PATTERNS } from './regex-patterns';
import { URLContext, QueryStringParam, ResourceLevel, ResourceType } from './types';
import { parseQueryString } from './qs-parser';
import { lookupCanisterId } from './phone-book';

const getResourceType = (name: string) => {
  switch ((name || '').toLowerCase()) {
    case 'info':
      return ResourceType.Info;
    case 'ledger_info':
      return ResourceType.LedgerInfo;
    case 'translate':
      return ResourceType.Translate;
    case 'library':
      return ResourceType.Library;
    case 'primary':
      return ResourceType.PrimaryAsset;
    case 'preview':
      return ResourceType.PreviewAsset;
    case 'hidden':
      return ResourceType.HiddenAsset;
    case 'ex':
      return ResourceType.ExperienceAsset;
    default:
      return ResourceType.Unknown;
  }
};

const cacheMap = new Map<string, string>();

const getCanisterId = async (collectionId: string): Promise<string> => {
  // return quickly from cache if exists
  let canisterId = cacheMap.get(collectionId);
  if (canisterId) {
    return canisterId;
  }

  // otherwise, lookup the canister ID (takes about 200 ms)
  canisterId = await lookupCanisterId(collectionId);
  if (canisterId) {
    cacheMap.set(collectionId, canisterId);
  }

  return canisterId;
};

export const parseURL = async (url: string): Promise<URLContext> => {
  const urlTrimmed = url?.trim() || '';

  if (urlTrimmed.length === 0) {
    throw new Error('Invalid url');
  }

  const queryStringParams: QueryStringParam[] = [];

  const ctx: URLContext = {
    fullUrl: url,
    port: '',
    canisterUrl: '',
    directCanisterUrl: '',
    canisterId: '',
    collectionId: '',
    canisterRelativeUrl: '',
    canisterRelativePath: '',
    queryStringParams,
    fragment: '',
    isLocal: false,
    isLocalToMainnet: false,
    isDirect: false,
    isRaw: false,
    resourceLevel: ResourceLevel.Unknown,
    resourceLevelText: '',
    resourceType: ResourceType.Unknown,
    resourceTypeText: '',
    tokenId: '',
    libraryId: '',
  };

  // Parse the part of the URL that reference the canister
  // The number of segments differs depending on the format used (direct or proxy URL)

  // Direct URLs to a canister include the canister ID
  // Same as the root URL or browser origin
  const directMatches = urlTrimmed.match(PATTERNS.DirectCanisterUrl);
  if (directMatches?.groups) {
    const id = directMatches.groups.id || '';
    const domain = directMatches.groups.domain || '';
    const port = directMatches.groups.port || '';

    ctx.isDirect = true;
    ctx.canisterUrl = directMatches[0];
    ctx.canisterId = PATTERNS.CanisterId.test(id) ? id : '';
    ctx.isRaw = domain.toLowerCase().startsWith('raw.');
    ctx.isLocal = domain.toLowerCase().includes('localhost');
    ctx.port = port;
  } else {
    // Proxy URLs to a canister include the canister ID or the collection ID.
    // Root URL + 2 additional segments.
    const proxyMatches = urlTrimmed.match(PATTERNS.ProxyCanisterUrl);
    if (proxyMatches?.groups) {
      const id = proxyMatches.groups.id || '';
      const domain = proxyMatches.groups.domain || '';
      const port = proxyMatches.groups.port || '';

      ctx.canisterUrl = proxyMatches[0];
      ctx.canisterId = PATTERNS.CanisterId.test(id) ? id : '';
      if (!ctx.canisterId) {
        ctx.canisterId = await getCanisterId(id);
        ctx.collectionId = id;
      }
      // the proxy always uses the raw URL internally
      ctx.isRaw = true;
      ctx.isLocal = domain.toLowerCase().includes('localhost');
      ctx.port = port;
      if (port === '9000') {
        ctx.isLocalToMainnet = true;
        ctx.isLocal = false;
      }
    }
  }

  // Handle the canister-relative URL (root-relative for direct URLs or pseudo root-relative for proxy URLs)
  if (urlTrimmed.length > ctx.canisterUrl.length) {
    ctx.canisterRelativeUrl = urlTrimmed.substring(ctx.canisterUrl.length);
    ctx.canisterRelativePath = ctx.canisterRelativeUrl;

    // parse the query string
    const posQueryString = ctx.canisterRelativeUrl.indexOf('?');
    if (posQueryString > -1 && ctx.canisterRelativeUrl.length > posQueryString + 1) {
      ctx.canisterRelativePath = ctx.canisterRelativeUrl.substring(0, posQueryString);
      ctx.queryStringParams = parseQueryString(
        ctx.canisterRelativeUrl.substring(posQueryString + 1),
      );
    }

    // parse the hash
    const posHash = ctx.canisterRelativeUrl.indexOf('#');
    if (posHash > -1 && ctx.canisterRelativeUrl.length > posHash + 1) {
      if (posQueryString === -1 || posHash < posQueryString) {
        ctx.canisterRelativePath = ctx.canisterRelativeUrl.substring(0, posHash);
      }
      ctx.fragment = ctx.canisterRelativeUrl.substring(posHash + 1);
    }
  }

  const collPathMatches = ctx.canisterRelativePath.match(PATTERNS.CollectionRelativeUrl);
  if (collPathMatches?.groups) {
    const known = collPathMatches.groups.known;
    const asset = collPathMatches.groups.asset;

    ctx.resourceLevel = ResourceLevel.Collection;
    if (known) {
      ctx.resourceType = getResourceType(known);
    } else if (asset) {
      ctx.libraryId = asset;
      ctx.resourceType = ResourceType.LibraryAsset;
    }
  } else {
    const tokenPathMatches = ctx.canisterRelativePath.match(PATTERNS.TokenRelativeUrl);
    if (tokenPathMatches?.groups) {
      const token = tokenPathMatches.groups.token;
      const known = tokenPathMatches.groups.known;
      const asset = tokenPathMatches.groups.asset;

      ctx.resourceLevel = ResourceLevel.Token;
      if (token) {
        ctx.tokenId = token;
      }
      if (known) {
        ctx.resourceType = getResourceType(known);
      } else if (asset) {
        ctx.libraryId = asset;
        ctx.resourceType = ResourceType.LibraryAsset;
      }
    }
  }

  ctx.resourceLevelText = ResourceLevel[ctx.resourceLevel];
  ctx.resourceTypeText = ResourceType[ctx.resourceType];

  // If the URL is local using port 9000 (isLocalToMainnet),
  // it's a local test URL pointing at a mainnet canister
  // running on webpack dev server configured for port 9000.
  // http://localhost:9000/-/brain-matters
  // In that case, the direct URL is the mainnet direct URL

  if (ctx.isLocal && !ctx.isLocalToMainnet) {
    ctx.directCanisterUrl = `http://${ctx.canisterId}.localhost:8080`;
  } else {
    // As of Apr 20, 2023, all existing and new canisters can be accessed with icp0.io.
    ctx.directCanisterUrl = `https://${ctx.canisterId}.raw.icp0.io`;
  }

  return ctx;
};
