/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { layout, space } from 'styled-system';
import { useRouter } from 'next/dist/client/router';

import Menu from '../Menu';
import Gallery from '../Gallery';
import { Photo } from '../../data';
import GalleryProvider from '../../lib/galleryContext';
import ProjectsProvider from '../../lib/projectsContext';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Content = styled.main`
  display: flex;
  position: relative;
  ${() =>
    space({
      px: [4],
      pt: ['100px', '100px', 5],
      pb: [5],
    })}
  ${() =>
    layout({
      width: ['100%'],
    })}
`;

export interface GalleryPageProps {
  title: string;
  urls: Photo[];
  index: number;
  description?: string;
  projects: { title: string; slug: string }[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({
  title,
  urls,
  index,
  description,
  projects,
}) => {
  const router = useRouter();
  const { asPath, pathname } = router;

  useEffect(() => {
    if (asPath.split('/').length < pathname.split('/').length + 1)
      router.push(pathname, `${router.asPath}/1`, {
        shallow: true,
      });
  }, [asPath, router, pathname]);

  return (
    <ProjectsProvider projects={projects}>
      <GalleryProvider
        title={title}
        urls={urls}
        description={description}
        index={index}
      >
        <>
          <Head>
            <title>Mikael Grundwaldt Photography</title>
          </Head>
          <Layout>
            <Menu />
            <Content>
              <Gallery />
            </Content>
          </Layout>
        </>
      </GalleryProvider>
    </ProjectsProvider>
  );
};

export default GalleryPage;
