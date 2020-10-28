import React from 'react';

import AdminProvider from './adminContext';
import FirebaseProvider from './firebaseContext';

const withAdminPageProviders = (Component: React.FC): React.FC => {
  const WrappedComponent = () => (
    <FirebaseProvider>
      <AdminProvider>
        <Component />
      </AdminProvider>
    </FirebaseProvider>
  );

  return WrappedComponent;
};

export default withAdminPageProviders;
