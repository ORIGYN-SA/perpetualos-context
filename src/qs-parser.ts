import { QueryStringParam } from './types';

/**
 * Converts a URL's query string to an array of objects with the name and value of each parameter.
 * @param queryString The part of the URL starting with or following the ? character.
 * @returns An array of objects with the name and value of each query string parameter.
 */
export const parseQueryString = (queryString: string): QueryStringParam[] => {
  const params: QueryStringParam[] = [];

  if (queryString.startsWith('?')) {
    queryString = queryString.substring(1);
  }

  const keyValuePairs = queryString.split('&');

  keyValuePairs.forEach((keyValuePair) => {
    const [name, value] = keyValuePair.split('=');
    params.push({ name, value });
  });

  return params;
};
