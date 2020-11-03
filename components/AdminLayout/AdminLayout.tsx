import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

import AdminMenu from '../AdminMenu';
import Title from '../Title';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Sidebar = styled.div`
  width: 240px;
  overflow-y: auto;
  flex-shrink: 0;
  ${() =>
    space({
      pl: [4],
      pr: [0],
      py: [5],
    })}
`;

const Content = styled.main`
  display: flex;
  position: relative;
  width: 100%;
  font-size: 0.8rem;
  ${() =>
    space({
      px: [4],
      py: [5],
    })}
`;

const AdminLayout: React.FC = ({ children }) => (
  <Container>
    <Head>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
    </Head>
    <Sidebar>
      <Title />
      <AdminMenu />
    </Sidebar>
    <Content>{children}</Content>
  </Container>
);

export default AdminLayout;
