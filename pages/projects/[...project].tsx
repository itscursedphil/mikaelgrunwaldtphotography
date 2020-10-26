/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import projectsData, { ProjectsData } from '../../data';
import GalleryPage, {
  GalleryPageProps,
} from '../../components/GalleryPage/GalleryPage';

const ProjectsPage: React.FC<GalleryPageProps> = (props) => (
  <GalleryPage {...props} />
);

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
  GalleryPageProps,
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
