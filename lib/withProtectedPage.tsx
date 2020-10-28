import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import useAdmin from '../hooks/useAdmin';
import withAdminPageProviders from './withAdminPageProviders';

const ProtectedPage: React.FC = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();
  const { user } = useAdmin();

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized || !user) {
    if (initialized && !user) router.push('/admin/login');
    return null;
  }

  return <>{children}</>;
};

const withProtectedPage = (Component: React.FC): React.FC => {
  const WrappedComponent = withAdminPageProviders(() => (
    <ProtectedPage>
      <Component />
    </ProtectedPage>
  ));

  return WrappedComponent;
};

export default withProtectedPage;
