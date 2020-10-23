import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import useGallery from '../../hooks/useGallery';
import GalleryImage, { TRANSITION_TIMEOUT } from './GalleryImage';

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
  const [index, setIndex] = useState(transitionIndex);
  const [transitioning, setTransitioning] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (hasPrevIndex) fetch(urls[prevIndex]);
    if (hasNextIndex) fetch(urls[nextIndex]);
  }, [prevIndex, nextIndex, urls, hasPrevIndex, hasNextIndex]);

  useEffect(() => {
    setTransitioning(true);

    const timeout = setTimeout(() => {
      setIndex(transitionIndex);
      setTransitioning(false);
    }, TRANSITION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
      setIndex(transitionIndex);
      setTransitioning(false);
    };
  }, [transitionIndex]);

  return (
    <GalleryContainer>
      <CSSTransition
        in={index === transitionIndex}
        appear={!initialized}
        onEntered={() => setInitialized(true)}
        timeout={
          initialized
            ? {
                enter: 0,
                exit: TRANSITION_TIMEOUT,
              }
            : {
                enter: TRANSITION_TIMEOUT * 0.5,
                exit: 0,
              }
        }
      >
        <GalleryImage
          style={{
            backgroundImage: `url(${urls[index]})`,
          }}
          appearIn={!initialized}
          animateOut={initialized}
        />
      </CSSTransition>
      <CSSTransition
        in={transitioning}
        appear={transitioning}
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
