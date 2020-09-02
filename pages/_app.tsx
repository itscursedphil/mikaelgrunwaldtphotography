import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import GlobalStyle from '../components/GlobalStyle';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
);

export default App;
