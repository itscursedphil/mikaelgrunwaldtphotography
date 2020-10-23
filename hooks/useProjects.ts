import { useContext } from 'react';

import { ProjectsContext, ProjectsState } from '../lib/projectsContext';

const useProjects = (): ProjectsState => {
  const context = useContext(ProjectsContext);

  if (!context)
    throw new Error(
      'ProjectsContext must be used within a ProjectsContextProvider'
    );

  return context;
};

export default useProjects;
