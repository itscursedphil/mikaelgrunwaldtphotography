import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import useGallery from '../../hooks/useGallery';
import GalleryImage from './GalleryImage';

export const TRANSITION_TIMEOUT = 500;

const GalleryContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const GalleryPrevOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
`;

const GalleryNextOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
`;

const Gallery: React.FC = () => {
  const {
    urls,
    index: transitionIndex,
    hasPrevIndex,
    hasNextIndex,
    prevIndex,
    nextIndex,
    navigateBack,
    navigateForward,
  } = useGallery();

  const [initialized, setInitialized] = useState(false);
  const [index, setIndex] = useState(!initialized ? transitionIndex : 0);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (!initialized) setInitialized(true);
  }, [initialized]);

  useEffect(() => {
    if (hasPrevIndex) fetch(urls[prevIndex]);
    if (hasNextIndex) fetch(urls[nextIndex]);
  }, [prevIndex, nextIndex, urls, hasPrevIndex, hasNextIndex]);

  useEffect(() => {
    setTransition(true);

    const timeout = setTimeout(() => {
      setIndex(transitionIndex);
      setTransition(false);
    }, TRANSITION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
      setIndex(transitionIndex);
      setTransition(false);
    };
  }, [transitionIndex]);

  return (
    <GalleryContainer>
      <CSSTransition
        in={index === transitionIndex}
        timeout={{
          enter: 0,
          exit: TRANSITION_TIMEOUT,
        }}
      >
        <GalleryImage
          style={{
            backgroundImage: `url(${urls[index]})`,
          }}
          animateOut
        />
      </CSSTransition>
      <CSSTransition
        in={transition}
        appear={transition}
        mountOnEnter
        unmountOnExit
        timeout={{
          enter: TRANSITION_TIMEOUT,
          exit: 0,
        }}
      >
        <GalleryImage
          style={{
            backgroundImage: `url(${urls[transitionIndex]})`,
          }}
          animateIn
        />
      </CSSTransition>
      <GalleryPrevOverlay onClick={navigateBack} />
      <GalleryNextOverlay onClick={navigateForward} />
    </GalleryContainer>
  );
};

export default Gallery;
