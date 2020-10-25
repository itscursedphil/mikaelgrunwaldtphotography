/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { layout, space } from 'styled-system';
import { useRouter } from 'next/dist/client/router';
import { GetStaticPaths, GetStaticProps } from 'next';

import Menu from '../../components/Menu';
import Gallery from '../../components/Gallery';
import projectsData, { ProjectsData, Photo } from '../../data';
import GalleryProvider from '../../lib/galleryContext';
import ProjectsProvider from '../../lib/projectsContext';
import GalleryNavigation from '../../components/GalleryNavigation';

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

interface ProjectsPageProps {
  urls: Photo[];
  index: number;
  projects: string[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  urls,
  index,
  projects,
}) => {
  const router = useRouter();
  const { asPath } = router;

  useEffect(() => {
    if (asPath.split('/').length < 4)
      router.push('projects/[...project]', `${router.asPath}/1`, {
        shallow: true,
      });
  }, [asPath, router]);

  return (
    <ProjectsProvider projects={projects}>
      <GalleryProvider urls={urls} index={index}>
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

export const getStaticPaths: GetStaticPaths<{
  project: string[];
}> = async () => {
  return {
    paths: [
      ...(Object.keys(projectsData) as Array<keyof ProjectsData>).map(
        (project) => ({
          params: {
            project: [project],
          },
        })
      ),
      ...(Object.keys(projectsData) as Array<keyof ProjectsData>)
        .map((project) =>
          projectsData[project].map((_, i) => ({
            params: {
              project: [project, (i + 1).toString()],
            },
          }))
        )
        .reduce((reduced, project) => [...reduced, ...project], []),
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  ProjectsPageProps,
  { project: [string, string] }
> = async ({ params }) => {
  if (!params?.project)
    return {
      props: {
        urls: [],
        index: 0,
        projects: [],
      },
    };

  const [project, indexString] = params?.project || [];

  const urls = project ? projectsData[project as keyof ProjectsData] : [];

  const index = indexString ? parseInt(indexString, 10) - 1 : 0;

  const projects = Object.keys(projectsData);

  return {
    props: {
      urls,
      index,
      projects,
    },
  };
};

export default ProjectsPage;
