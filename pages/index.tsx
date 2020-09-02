import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

const Title = styled.h1`
  color: red;
`;

const Home: React.FC = () => (
  <div>
    <Head>
      <title>Mikael Grundwaldt Photography</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Title>Mikael Grunwaldt Photography</Title>
  </div>
);

export default Home;
