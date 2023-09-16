/**
 * Builds an Origyn PerpetualOS Canister URL directly to an Origyn NFT canister.
 * For files over 2 MB, use `getProxyCanisterUrl` for streaming support.
 * @param canisterId - The canister ID of an Origyn NFT collection.
 * @param isRaw - true if the URL should include the `raw` subdomain to skip certifying data.
 * Defaults to true.
 * @param isLocal - true if the URL should target a local instance of the Origyn NFT canister
 * @returns A properly formatted Canister URL. This should be treated as a root URL and will need
 * to be appended with a canister-relative URL.
 */
export const getDirectCanisterUrl = (
  canisterId: string,
  isRaw: boolean = true,
  isLocal: boolean = false,
): string => {
  if (isLocal) {
    // localhost does not use raw since it doesn't certify data like mainnet
    return `http://${canisterId}.localhost:8080`;
  } else if (isRaw) {
    // As of Apr 20, 2023, all existing and new canisters can be accessed with icp0.io.
    return `https://${canisterId}.raw.icp0.io`;
  } else {
    // Note that Origyn NFT canisters do not currently support URLs without raw (certified data)
    return `https://${canisterId}.icp0.io`;
  }
};

/**
 * Builds an Origyn PerpetualOS Canister URL to the Origyn ICX-Proxy. The proxy provides streaming
 * support for images and videos over 2 MB to ensure full and smooth rendering/playing in client dApps.
 * The Internet Computer does not provide streaming support directly from canisters.
 * @param canisterOrCollectionId - A canister ID or collection ID of an Origyn NFT collection
 * which is registered in the Origyn Phone Book canister
 * @param isLocal - true if the URL should target a local instance of the Origyn ICX-Proxy,
 * Phone Book canister, and Origyn NFT canister
 * @param localProxyPort - the port that your local proxy is running on. Defaults to port 3000.
 * Ignored if isLocal is false.
 * @returns A properly formatted Canister URL. This should be treated as a root URL and will need
 * to be appended with a canister-relative URL.
 */
export const getProxyCanisterUrl = (
  canisterOrCollectionId: string,
  isLocal: boolean = false,
  localProxyPort: number = 3000,
): string => {
  if (isLocal) {
    // defaults to port 3000, the local http port used by https://github.com/ORIGYN-SA/icx-proxy
    return `http://localhost:${localProxyPort}/-/${canisterOrCollectionId}`;
  } else {
    return `https://prptl.io/-/${canisterOrCollectionId}`;
  }
};
