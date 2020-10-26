/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import GalleryPage, {
  GalleryPageProps,
} from '../components/GalleryPage/GalleryPage';
import projectsData from '../data';
import portfolioData from '../data/portfolio.json';

const ProjectsPage: React.FC<GalleryPageProps> = (props) => (
  <GalleryPage {...props} />
);

export const getStaticPaths: GetStaticPaths<{
  portfolio: string[];
}> = async () => {
  return {
    paths: [
      {
        params: {
          portfolio: ['portfolio'],
        },
      },
      ...portfolioData.map((_, i) => ({
        params: {
          portfolio: ['portfolio', (i + 1).toString()],
        },
      })),
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  GalleryPageProps,
  { portfolio: [string, string] }
> = async ({ params }) => {
  if (!params?.portfolio)
    return {
      props: {
        urls: [],
        index: 0,
        projects: [],
      },
    };

  const [, indexString] = params?.portfolio || [];

  const urls = portfolioData;

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
