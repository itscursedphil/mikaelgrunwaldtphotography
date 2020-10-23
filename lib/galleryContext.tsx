import React, { createContext } from 'react';

export interface GalleryState {
  index: number;
  urls: string[];
}

export const GalleryContext = createContext<GalleryState | undefined>(
  undefined
);

const GalleryProvider: React.FC<{ urls: string[]; index: number }> = ({
  children,
  urls,
  index,
}) => {
  return (
    <GalleryContext.Provider value={{ index, urls }}>
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;
