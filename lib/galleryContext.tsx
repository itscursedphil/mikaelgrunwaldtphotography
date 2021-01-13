import React, { createContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

import { Photo } from '../data';
import { stripHashFromUrl, stripIndexFromUrl } from './url';

export interface GalleryState {
  title: string;
  urls: Photo[];
  project: string;
  description?: string;
  index: number;
  hasPrevIndex: boolean;
  hasNextIndex: boolean;
  prevIndex: number;
  nextIndex: number;
  prevUrl: string;
  nextUrl: string;
  navigateBack: () => void;
  navigateForward: () => void;
}

export const GalleryContext = createContext<GalleryState | undefined>(
  undefined
);

const getPrevIndex = (index: number, length: number) =>
  (index - 1 + length) % length;
const getNextIndex = (index: number, length: number) => (index + 1) % length;

const GalleryProvider: React.FC<{
  title: string;
  urls: Photo[];
  index: number;
  description?: string;
}> = ({ children, title, urls, index, description }) => {
  const router = useRouter();

  const project = router.query?.project?.length ? router.query?.project[0] : '';

  const hasPrevIndex = index > 0;
  const hasNextIndex = index < urls.length - 2;

  const prevIndex = getPrevIndex(index, urls.length);
  const nextIndex = getNextIndex(index, urls.length);

  const prevUrl = `${stripIndexFromUrl(stripHashFromUrl(router.asPath))}/${
    prevIndex + 1
  }`;
  const nextUrl = `${stripIndexFromUrl(stripHashFromUrl(router.asPath))}/${
    nextIndex + 1
  }`;

  const navigateBack = () => router.push(router.pathname, prevUrl);
  const navigateForward = () => router.push(router.pathname, nextUrl);

  useEffect(() => {
    setTimeout(() => urls.forEach(({ small }) => fetch(small)), 100);
  }, [urls]);

  return (
    <GalleryContext.Provider
      value={{
        title,
        index,
        urls,
        project,
        description,
        hasPrevIndex,
        hasNextIndex,
        prevIndex,
        nextIndex,
        prevUrl,
        nextUrl,
        navigateBack,
        navigateForward,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;
