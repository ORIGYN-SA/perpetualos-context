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

export const getProxyCanisterUrl = (
  canisterId: string,
  isLocal: boolean = false,
  localProxyPort: number = 3000,
): string => {
  if (isLocal) {
    // defaults to port 3000, the local http port used by https://github.com/ORIGYN-SA/icx-proxy
    return `http://localhost:${localProxyPort}/-/${canisterId}`;
  } else {
    return `https://prptl.io/-/${canisterId}`;
  }
};
