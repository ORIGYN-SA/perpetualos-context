import { parseURL } from './url-parser';
import { URLContext } from './types';

export * from './types';
export * from './regex-patterns';
export * from './phone-book';

export const getPerpetualOSContext = async (url: string): Promise<URLContext> => {
  return parseURL(url);
};
