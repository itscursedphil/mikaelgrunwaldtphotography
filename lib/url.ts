export const getUrlHash = (url: string): string =>
  typeof window === 'undefined'
    ? ''
    : new URL(window.location.origin + url).hash;

export const getUrlWithToggledHash = (url: string, hash: string): string => {
  if (typeof window === 'undefined') {
    return `${url}${hash}`;
  }

  const urlHash = getUrlHash(url);

  return urlHash === hash
    ? window.location.pathname
    : window.location.pathname + hash;
};

export const stripHashFromUrl = (url: string): string =>
  url.replace(getUrlHash(url), '');

export const stripIndexFromUrl = (url: string): string => {
  const urlSegments = url.split('/');

  const urlEndSegment = urlSegments[urlSegments.length - 1];
  const urlSegmentNum = parseInt(urlEndSegment, 10);

  if (`${urlSegmentNum}` !== urlEndSegment) return url;

  return urlSegments.filter((_, i, arr) => i < arr.length - 1).join('/');
};
