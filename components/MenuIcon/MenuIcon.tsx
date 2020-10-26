import React from 'react';
import styled, { css } from 'styled-components';
import { display, space } from 'styled-system';

const Line = styled.span<{ open: boolean }>`
  display: block;
  width: 100%;
  height: 0;
  border-bottom: 1px solid black;
  position: absolute;
  left: 0;

  &:nth-child(1) {
    top: 0;
    opacity: 1;
    transform: translateY(0);
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;

    ${({ open }) =>
      open &&
      css`
        opacity: 0;
        transform: translateY(-0.5rem);
      `}
  }

  &:nth-child(2),
  &:nth-child(3) {
    top: 50%;
    transform: rotate(0deg);
    transition: transform 0.5s ease-in-out;
  }

  &:nth-child(2) {
    ${({ open }) =>
      open &&
      css`
        transform: rotate(-45deg);
      `}
  }

  &:nth-child(3) {
    ${({ open }) =>
      open &&
      css`
        transform: rotate(45deg);
      `}
  }

  &:nth-child(4) {
    top: 100%;
    opacity: 1;
    transform: translateY(0);
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;

    ${({ open }) =>
      open &&
      css`
        opacity: 0;
        transform: translateY(0.5rem);
      `}
  }
`;

const Container = styled.a`
  width: 2rem;
  height: 1rem;
  position: relative;
  background-color: white;
  pointer-events: auto;
  ${() =>
    display({
      display: ['block', 'block', 'none'],
    })}
  ${() => space({ mt: 3 })}
`;

const MenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <Container href="#" title="Open menu">
    <Line open={open} />
    <Line open={open} />
    <Line open={open} />
    <Line open={open} />
  </Container>
);

export default MenuIcon;
