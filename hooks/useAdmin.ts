import { useContext } from 'react';

import { AdminContext, AdminState } from '../lib/adminContext';

const useAdmin = (): AdminState => {
  const context = useContext(AdminContext);

  if (!context)
    throw new Error('AdminContext must be used within a AdminContextProvider');

  return context;
};

export default useAdmin;
