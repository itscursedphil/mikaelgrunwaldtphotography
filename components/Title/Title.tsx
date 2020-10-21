/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

const StyledTitle = styled.h1`
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  width: 140px;
  margin: 0;
  padding: 0;
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
