import styled from 'styled-components';

import { TRANSITION_TIMEOUT } from './Gallery';

const GalleryImage = styled.div<{
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

export default GalleryImage;
