import { useContext } from 'react';

import { GalleryContext, GalleryState } from '../lib/galleryContext';

const useGallery = (): GalleryState => {
  const context = useContext(GalleryContext);

  if (!context)
    throw new Error(
      'GalleryContext must be used within a GalleryContextProvider'
    );

  return context;
};

export default useGallery;
