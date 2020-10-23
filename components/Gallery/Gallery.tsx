import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import useGallery from '../../hooks/useGallery';

const TRANSITION_TIMEOUT = 500;

const GalleryImageContainer = styled.div<{
  animateIn?: boolean;
  animateOut?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;

  ${({ animateIn }) =>
    animateIn &&
    `
    opacity: 0;

    &.enter {
      transition: opacity ${TRANSITION_TIMEOUT}ms ease-in-out;
      opacity: 0;
    }

    &.enter-active {
      opacity: 1;
    }`}

  ${({ animateOut }) =>
    animateOut &&
    `
  &.exit {
    transition: opacity ${TRANSITION_TIMEOUT}ms ease-in-out;
    opacity: 1;
  }

  &.exit-active {
    opacity: 0;
  }`}
`;

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

const getPrevIndex = (index: number, length: number) =>
  (index - 1 + length) % length;
const getNextIndex = (index: number, length: number) => (index + 1) % length;

const Gallery: React.FC = () => {
  const router = useRouter();
  const { urls, index: transitionIndex } = useGallery();

  console.log(urls);

  const [initialized, setInitialized] = useState(false);
  const [index, setIndex] = useState(!initialized ? transitionIndex : 0);
  const [transition, setTransition] = useState(false);

  const hasPrevIndex = transitionIndex > 0;
  const hasNextIndex = transitionIndex < urls.length - 2;

  const prevIndex = getPrevIndex(transitionIndex, urls.length);
  const nextIndex = getNextIndex(transitionIndex, urls.length);

  const project = router.query?.project?.length ? router.query?.project[0] : '';

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
        <GalleryImageContainer
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
        <GalleryImageContainer
          style={{
            backgroundImage: `url(${urls[transitionIndex]})`,
          }}
          animateIn
        />
      </CSSTransition>
      <GalleryPrevOverlay
        onClick={() => {
          router.push(`/projects/${project}/${prevIndex + 1}`);
        }}
      />
      <GalleryNextOverlay
        onClick={() => {
          router.push(`/projects/${project}/${nextIndex + 1}`);
        }}
      />
    </GalleryContainer>
  );
};

export default Gallery;
