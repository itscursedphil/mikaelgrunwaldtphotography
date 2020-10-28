import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Spinner } from 'reactstrap';
import Head from 'next/head';

import useAdmin from '../hooks/useAdmin';
import withAdminPageProviders from './withAdminPageProviders';
import Box from '../components/Box';

export const LoadingPage: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <Head>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
    </Head>
    <Spinner />
  </Box>
);

const ProtectedPage: React.FC = ({ children }) => {
  const router = useRouter();
  const { user, initialized } = useAdmin();

  if (!initialized || !user) {
    if (initialized && !user) router.push('/admin/login');
    return <LoadingPage />;
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
