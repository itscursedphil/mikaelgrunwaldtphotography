import React, { createContext } from 'react';

export interface Project {
  slug: string;
  label: string;
}

export interface ProjectsState {
  projects: Project[];
}

export const ProjectsContext = createContext<ProjectsState | undefined>(
  undefined
);

const ProjectsProvider: React.FC<{ projects: string[] }> = ({
  children,
  projects: slugs,
}) => {
  const projects = slugs.map((slug) => ({
    slug,
    label: slug[0].toUpperCase() + slug.substring(1, slug.length),
  }));

  return (
    <ProjectsContext.Provider value={{ projects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
