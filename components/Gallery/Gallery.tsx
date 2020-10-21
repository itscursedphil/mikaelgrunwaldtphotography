import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

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
      transition: opacity 1000ms ease-in-out;
      opacity: 0;
    }

    &.enter-active {
      opacity: 1;
    }`}

  ${({ animateOut }) =>
    animateOut &&
    `
  &.exit {
    transition: opacity 1000ms ease-in-out;
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

const TRANSITION_TIMEOUT = 1000;

const Gallery: React.FC<{ urls: string[] }> = ({ urls }) => {
  const [index, setIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [transition, setTransition] = useState(false);

  const prevIndex = getPrevIndex(index, urls.length);
  const nextIndex = getNextIndex(index, urls.length);

  useEffect(() => {
    fetch(urls[prevIndex]);
    fetch(urls[nextIndex]);
  }, [prevIndex, nextIndex, urls]);

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
          setTransitionIndex(prevIndex);
        }}
      />
      <GalleryNextOverlay
        onClick={() => {
          setTransitionIndex(nextIndex);
        }}
      />
    </GalleryContainer>
  );
};

export default Gallery;
