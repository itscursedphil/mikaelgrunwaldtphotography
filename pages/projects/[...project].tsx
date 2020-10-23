/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { layout } from 'styled-system';

import { GetStaticPaths, GetStaticProps } from 'next';
import Menu from '../../components/Menu';
import Gallery from '../../components/Gallery';
import { innerSpace } from '../../lib/styles';
import GalleryProvider from '../../lib/galleryContext';

import animalsData from '../../data/animals.json';
import cityData from '../../data/city.json';
import natureData from '../../data/nature.json';
import peopleData from '../../data/people.json';

interface ProjectsData {
  animals: string[];
  city: string[];
  nature: string[];
  people: string[];
}

const projectsData: ProjectsData = {
  animals: animalsData,
  city: cityData,
  nature: natureData,
  people: peopleData,
};

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

interface ProjectsPageProps {
  urls: string[];
  index: number;
  projects: string[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  urls,
  index,
  projects,
}) => {
  return (
    <div>
      <Head>
        <title>Mikael Grundwaldt Photography</title>
      </Head>
      <Layout>
        <GalleryProvider urls={urls} index={index}>
          <Menu />
          <Content>
            <Gallery />
          </Content>
        </GalleryProvider>
      </Layout>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<{
  project: string[];
}> = async () => {
  return {
    paths: [
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
