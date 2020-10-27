import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import useGallery from '../../hooks/useGallery';
import GalleryInfo from '../GalleryInfo';
import GalleryOverview from '../GalleryOverview';
import GalleryImage, { TRANSITION_TIMEOUT } from './GalleryImage';
import useSwipe from '../../hooks/useSwipe';

const GalleryContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  touch-action: none;
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
  const swipeHandlers = useSwipe({
    onLeft: navigateForward,
    onRight: navigateBack,
  });

  useEffect(() => {
    if (hasPrevIndex) setTimeout(() => fetch(urls[prevIndex].full), 100);
    if (hasNextIndex) setTimeout(() => fetch(urls[nextIndex].full), 100);
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

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateBack();
          break;
        case 'ArrowRight':
          navigateForward();
          break;
        default:
      }
    },
    [navigateBack, navigateForward]
  );

  useEffect(() => {
    window.addEventListener('keyup', handleKeyEvent);

    return () => window.removeEventListener('keyup', handleKeyEvent);
  }, [handleKeyEvent]);

  return (
    <GalleryContainer {...swipeHandlers}>
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
            backgroundImage: `url(${urls[index].full})`,
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
            backgroundImage: `url(${urls[transitionIndex].full})`,
          }}
          animateIn
        />
      </CSSTransition>
      <GalleryPrevOverlay onClick={navigateBack} />
      <GalleryNextOverlay onClick={navigateForward} />
      <GalleryInfo />
      <GalleryOverview urls={urls} />
    </GalleryContainer>
  );
};

export default Gallery;
