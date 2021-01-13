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

const ProjectsProvider: React.FC<{
  projects: { title: string; slug: string }[];
}> = ({ children, projects }) => {
  return (
    <ProjectsContext.Provider
      value={{
        projects: projects.map(({ title, slug }) => ({ label: title, slug })),
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
