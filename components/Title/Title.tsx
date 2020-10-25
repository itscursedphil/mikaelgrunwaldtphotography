/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { space, typography, layout } from 'styled-system';

const StyledTitle = styled.h1`
  font-weight: bold;
  line-height: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  padding: 0;
  pointer-events: auto;
  ${() =>
    typography({
      fontSize: ['0.8rem', '0.8rem', '1rem'],
    })}
  ${() =>
    layout({
      width: ['120px', '120px', '140px'],
    })}
  ${() =>
    space({
      m: 0,
      mb: 4,
    })}

  a:link,
  a:active,
  a:visited,
  a:focus,
  a:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const Subtitle = styled.span`
  font-weight: normal;
`;

const Title: React.FC = () => (
  <StyledTitle>
    <a href="#" title="Mikael Grunwaldt Photography">
      Mikael Grundwaldt <Subtitle>Photography</Subtitle>
    </a>
  </StyledTitle>
);

export default Title;
