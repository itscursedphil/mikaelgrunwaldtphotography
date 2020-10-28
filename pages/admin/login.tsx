import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { Button, FormGroup, Label, Input, Spinner, Alert } from 'reactstrap';

import { useRouter } from 'next/dist/client/router';
import useAdmin from '../../hooks/useAdmin';
import Box from '../../components/Box';
import withAdminPageProviders from '../../lib/withAdminPageProviders';
import { LoadingPage } from '../../lib/withProtectedPage';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${() => space({ p: [3] })}
`;

const Content = styled.div`
  width: 100%;
  max-width: 280px;
`;

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const { user, loginUser, initialized: userInitialized } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) router.push('/admin');
  }, [user, router]);

  if (!userInitialized) return <LoadingPage />;

  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
      </Head>
      <Content>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            setError(false);
            setLoading(true);

            try {
              await loginUser(email, password);
            } catch (err) {
              setError(true);
              setLoading(false);
            }
          }}
        >
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="with a placeholder"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="password placeholder"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </FormGroup>
          {error && (
            <Alert color="warning">Leider gab es ein Problem beim Login</Alert>
          )}
          {!loading ? (
            <Button color="primary" type="submit" disabled={loading}>
              Sign in
            </Button>
          ) : (
            <Box display="flex" justifyContent="center">
              <Spinner />
            </Box>
          )}
        </form>
      </Content>
    </Container>
  );
};

export default withAdminPageProviders(AdminLoginPage);
