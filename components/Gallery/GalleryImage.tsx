import React from 'react';
import styled from 'styled-components';

export const TRANSITION_TIMEOUT = 500;

const StyledGalleryImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 1;

  &.appear-in {
    opacity: 0;

    &.enter {
      transition: opacity ${TRANSITION_TIMEOUT * 2}ms ease-in-out;

      &-active {
        opacity: 1;
      }

      &-done {
        transition: none;
        opacity: 1;
      }
    }
  }

  &.animate-in {
    opacity: 0;

    &.enter {
      transition: opacity ${TRANSITION_TIMEOUT}ms ease-in-out;

      &-active {
        opacity: 1;
      }

      &-done {
        transition: none;
        opacity: 1;
      }
    }
  }

  &.animate-out {
    &.exit {
      transition: opacity ${TRANSITION_TIMEOUT}ms ease-in-out;

      &-active {
        opacity: 0;
      }
    }
  }
`;

const GalleryImage: React.FC<{
  animateIn?: boolean;
  animateOut?: boolean;
  appearIn?: boolean;
  style: React.CSSProperties;
}> = ({ appearIn, animateIn, animateOut, style }) => (
  <StyledGalleryImage
    className={[
      appearIn ? 'appear-in' : '',
      animateIn && !appearIn ? 'animate-in' : '',
      animateOut ? 'animate-out' : '',
    ]
      .join(' ')
      .trim()}
    style={{
      ...style,
    }}
  />
);

export default GalleryImage;
