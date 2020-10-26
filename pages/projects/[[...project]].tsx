/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';

import projectsData, { ProjectsData } from '../../data';
import GalleryPage, {
  GalleryPageProps,
} from '../../components/GalleryPage/GalleryPage';

const ProjectsPage: React.FC<GalleryPageProps> = (props) => {
  const router = useRouter();

  const { urls, projects } = props;

  useEffect(() => {
    if (!urls.length) {
      router.push('/projects/[...project]', `/projects/${projects[0]}`);
    }
  }, [projects, router, urls.length]);

  if (!urls.length) return null;

  return <GalleryPage {...props} />;
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
      {
        params: {
          project: [],
        },
      },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  GalleryPageProps,
  { project: [string, string] }
> = async ({ params }) => {
  const projects = Object.keys(projectsData);

  if (!params?.project?.length)
    return {
      props: {
        urls: [],
        index: 0,
        projects,
      },
    };

  const [project, indexString] = params?.project || [];

  const urls = project ? projectsData[project as keyof ProjectsData] : [];

  const index = indexString ? parseInt(indexString, 10) - 1 : 0;

  return {
    props: {
      urls,
      index,
      projects,
    },
  };
};

export default ProjectsPage;
