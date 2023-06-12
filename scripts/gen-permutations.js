/*
Before running this script, add temporary code at the top of
the phone-book.ts lookupCanisterId function:

  if (collectionId === 'brain-matters') {
    return 'fghij-biaaa-aaaal-qbhwa-cai';
  }

Then run 'npm run build'.

Otherwise the function will query the phone book canister for
canister IDs.

After generating the permutations, manually verify that all expected
outputs are correct.
*/

const fs = require('fs');
const { getPerpetualOSContext } = require('../dist/index');

const generateUrlPermutations = async () => {
  const canisterId = 'abcde-biaaa-aaaal-qbhwa-cai';
  const collectionId = 'brain-matters';
  const tokenId = 'some-token-id';

  const resourceTypes = [
    'info',
    'ledger_info',
    'translate',
    'library',
    'primary',
    'preview',
    'hidden',
    'ex',
    '-/file-name.png',
  ];

  const mainnetDomains = ['raw.ic0.app', 'ic0.app', 'raw.icp0.io', 'icp0.io'];

  const proxyDomains = ['prptl.io', 'exos.origyn.network'];

  let urls = [];

  for (const resourceType of resourceTypes) {
    // Direct Localhost
    urls.push(`http://${canisterId}.localhost:8080/collection/${resourceType}`);
    urls.push(`http://${canisterId}.localhost:8080/-/${tokenId}/${resourceType}`);

    // Localhost dev server pointing to local canister for testing
    urls.push(`http://localhost:8081/-/${canisterId}/collection/${resourceType}`);
    urls.push(`http://localhost:8081/-/${canisterId}/-/${tokenId}/${resourceType}`);

    // Localhost dev server pointing to mainnet canister for testing
    urls.push(`http://localhost:9000/-/${canisterId}/collection/${resourceType}`);
    urls.push(`http://localhost:9000/-/${canisterId}/-/${tokenId}/${resourceType}`);
    urls.push(`http://localhost:9000/-/${collectionId}/collection/${resourceType}`);
    urls.push(`http://localhost:9000/-/${collectionId}/-/${tokenId}/${resourceType}`);

    // Direct Mainnet
    for (const mainnetDomain of mainnetDomains) {
      urls.push(`https://${canisterId}.${mainnetDomain}/collection/${resourceType}`);
      urls.push(`https://${canisterId}.${mainnetDomain}/-/${tokenId}/${resourceType}`);
    }

    // Proxy Localhost
    urls.push(`http://localhost:3000/-/${canisterId}/collection/${resourceType}`);
    urls.push(`http://localhost:3000/-/${canisterId}/-/${tokenId}/${resourceType}`);

    // Proxy Mainnet
    for (const proxyDomain of proxyDomains) {
      urls.push(`https://${proxyDomain}/-/abcde-biaaa-aaaal-qbhwa-cai/collection/${resourceType}`);
      urls.push(
        `https://${proxyDomain}/-/abcde-biaaa-aaaal-qbhwa-cai/-/${tokenId}/${resourceType}`,
      );
    }

    // Phonebook Localhost
    urls.push(`http://localhost:3000/-/${collectionId}/collection/${resourceType}`);
    urls.push(`http://localhost:3000/-/${collectionId}/-/${tokenId}/${resourceType}`);

    // Phonebook Mainnet
    for (const phonebookDomain of proxyDomains) {
      urls.push(`https://${phonebookDomain}/-/brain-matters/collection/${resourceType}`);
      urls.push(`https://${phonebookDomain}/-/brain-matters/-/${tokenId}/${resourceType}`);
    }
  }

  const urlsWithFragment = urls.map((url) => `${url}#/some-fragment`);
  const urlsWithQs = urls.map((url) => `${url}?page=home&nav=3&connected=true`);

  urls = [...urls, ...urlsWithFragment, ...urlsWithQs];

  const results = [];
  for (const url of urls) {
    const expectedResult = await getPerpetualOSContext(url);
    results.push({ url, expectedResult });
  }

  return results;
};

const run = async () => {
  const permutations = await generateUrlPermutations();
  console.log('permutations: ', permutations.length);
  fs.writeFileSync(
    './src/__tests__/unit/url-parser.test.json',
    JSON.stringify(permutations, null, 2),
  );
};

run();
