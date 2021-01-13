/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import GalleryPage, {
  GalleryPageProps,
} from '../components/GalleryPage/GalleryPage';
import projectsData, { ProjectsData } from '../data';
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
      ...portfolioData.photos.map((_, i) => ({
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
        title: '',
        urls: [],
        index: 0,
        projects: [],
      },
    };

  const [, indexString] = params?.portfolio || [];

  const { photos: urls, title, description } = portfolioData;

  const index = indexString ? parseInt(indexString, 10) - 1 : 0;

  const projects = (Object.keys(projectsData) as Array<keyof ProjectsData>).map(
    (key) => {
      const { title: projectTitle, slug } = projectsData[key];

      return { title: projectTitle, slug };
    }
  );

  return {
    props: {
      title,
      urls,
      index,
      description,
      projects,
    },
  };
};

export default ProjectsPage;
