import { NextRouter } from 'next/dist/client/router';

export const getUrlHash = (): string =>
  typeof window === 'undefined' ? '' : new URL(window.location.href).hash;

export const getUrlWithToggledHash = (
  hash: string,
  router: NextRouter
): string => {
  if (typeof window === 'undefined') {
    return `${router.asPath}hash`;
  }

  const urlHash = getUrlHash();

  return urlHash === hash
    ? window.location.pathname
    : window.location.pathname + hash;
};
