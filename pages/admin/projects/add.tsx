import React from 'react';
import AdminLayout from '../../../components/AdminLayout';

import GalleryEdit from '../../../components/GalleryEdit';
import withProtectedPage from '../../../lib/withProtectedPage';

const ProjectAddPage = () => (
  <AdminLayout>
    <GalleryEdit />
  </AdminLayout>
);

export default withProtectedPage(ProjectAddPage);
