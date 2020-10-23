import React, { createContext } from 'react';
import { useRouter } from 'next/dist/client/router';

export interface GalleryState {
  urls: string[];
  project: string;
  index: number;
  hasPrevIndex: boolean;
  hasNextIndex: boolean;
  prevIndex: number;
  nextIndex: number;
  navigateBack: () => void;
  navigateForward: () => void;
}

export const GalleryContext = createContext<GalleryState | undefined>(
  undefined
);

const getPrevIndex = (index: number, length: number) =>
  (index - 1 + length) % length;
const getNextIndex = (index: number, length: number) => (index + 1) % length;

const GalleryProvider: React.FC<{ urls: string[]; index: number }> = ({
  children,
  urls,
  index,
}) => {
  const router = useRouter();

  const project = router.query?.project?.length ? router.query?.project[0] : '';

  const hasPrevIndex = index > 0;
  const hasNextIndex = index < urls.length - 2;

  const prevIndex = getPrevIndex(index, urls.length);
  const nextIndex = getNextIndex(index, urls.length);

  const navigateBack = () =>
    router.push(`/projects/${project}/${prevIndex + 1}`);
  const navigateForward = () =>
    router.push(`/projects/${project}/${nextIndex + 1}`);

  return (
    <GalleryContext.Provider
      value={{
        index,
        urls,
        project,
        hasPrevIndex,
        hasNextIndex,
        prevIndex,
        nextIndex,
        navigateBack,
        navigateForward,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;
