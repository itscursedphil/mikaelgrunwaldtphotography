import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.05em;
  }

  html, body, #__next {
    height: 100%
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
