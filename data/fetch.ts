import { promises as fs } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';

import { Photo } from './index';

const projectNames = ['animals', 'city', 'nature', 'people'];

export interface Project {
  name: string;
  photos: Photo[];
}

const fetchPhotos = async (project: string): Promise<Project> => {
  const queryAmount = Math.round(Math.random() * 30) + 20;

  const res = await fetch(
    `https://api.pexels.com/v1/search?per_page=${queryAmount}&query=${project}`,
    {
      headers: {
        Authorization:
          '563492ad6f917000010000015f0acf7941034c18a1086ea480e4e648',
      },
    }
  );

  const data = await res.json();

  const photos = data.photos.map(({ src }: { src: any }) => ({
    full: src.large2x,
    small: src.tiny,
  }));

  return {
    name: project,
    photos,
  };
};

const fetchProjects = async () => {
  const projectsWithPhotos = await Promise.all(projectNames.map(fetchPhotos));

  await Promise.all(
    projectsWithPhotos.map((project) =>
      fs.writeFile(`data/${project.name}.json`, JSON.stringify(project.photos))
    )
  );
};

fetchProjects();
