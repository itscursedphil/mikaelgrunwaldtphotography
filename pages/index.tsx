/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { layout } from 'styled-system';

import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import { innerSpace } from '../lib/styles';

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const Content = styled.main`
  ${innerSpace}
  ${() =>
    layout({
      width: ['100%'],
    })}
  display: flex;
`;

interface GalleryPageProps {
  photos: string[];
}

const Home: React.FC<GalleryPageProps> = ({ photos }) => {
  console.log(photos);

  return (
    <div>
      <Head>
        <title>Mikael Grundwaldt Photography</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Menu />
        <Content>
          <Gallery urls={photos} />
        </Content>
      </Layout>
    </div>
  );
};

export const getStaticProps = async (): Promise<{
  props: GalleryPageProps;
}> => {
  const queryOptions = ['people', 'animals', 'nature', 'city'];
  const query = queryOptions[Math.round(Math.random() * queryOptions.length)];
  const queryAmount = Math.round(Math.random() * 30) + 20;

  const res = await fetch(
    `https://api.pexels.com/v1/search?per_page=${queryAmount}&query=${query}`,
    {
      headers: {
        Authorization:
          '563492ad6f917000010000015f0acf7941034c18a1086ea480e4e648',
      },
    }
  );

  const data = await res.json();

  const photos = data.photos.map(({ src }: { src: any }) => src.large);

  return {
    props: {
      photos,
    },
  };
};

export default Home;
