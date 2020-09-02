/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
import { space, layout } from 'styled-system';

interface NavigationItem {
  to: string;
  label: string;
  items?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    to: '#',
    label: 'Portfolio',
  },
  {
    to: '#',
    label: 'Projects',
  },
  {
    to: '#',
    label: 'About',
  },
];

const innerSpace = css`
  ${() =>
    space({
      px: [3],
      py: [4],
    })}
`;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const Menu = styled.header<{ inactive: boolean }>`
  &:not(:hover) {
    opacity: ${({ inactive }) => (inactive ? 0.2 : 1)};
  }
  transition: opacity 0.6s ease-in-out;
  ${innerSpace}
  ${() =>
    layout({
      width: ['280px'],
    })}
`;

const Content = styled.main`
  ${innerSpace}
  ${() =>
    layout({
      width: ['100%'],
    })}
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  width: 140px;
  margin: 0;
  padding: 0;
  ${() =>
    space({
      m: 0,
      mb: 4,
    })}

  a:link,
  a:active,
  a:visited,
  a:focus,
  a:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const Subtitle = styled.span`
  font-weight: normal;
`;

const Navigation = styled.nav``;

const NavigationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const NavigationListItem = styled.li`
  font-size: 0.8rem;
  line-height: 1.6rem;
  margin: 0;
  padding: 0;
`;

const NavigationItemLink = styled.a`
  &,
  &:visited,
  &:active {
    color: rgba(0, 0, 0, 0.4);
    text-decoration: none;
    transition: all 0.1s ease-in-out;
  }

  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 1);
  }
`;

const Home: React.FC = () => {
  const [inactive, setInactive] = useState(false);

  const timeoutRef = useRef<number | undefined>();
  const handleMouseMove = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInactive(false);

    timeoutRef.current = setTimeout(() => {
      setInactive(true);
    }, 4000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div>
      <Head>
        <title>Mikael Grundwaldt Photography</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Menu inactive={inactive}>
          <Title>
            <a href="#" title="Mikael Grunwaldt Photography">
              Mikael Grundwaldt <Subtitle>Photography</Subtitle>
            </a>
          </Title>
          <Navigation>
            <NavigationList>
              {navigationItems.map(({ to, label }) => (
                <NavigationListItem key={label}>
                  <NavigationItemLink href={to} title={label}>
                    {label}
                  </NavigationItemLink>
                </NavigationListItem>
              ))}
            </NavigationList>
          </Navigation>
        </Menu>
        <Content>Dolor Sit Amet</Content>
      </Layout>
    </div>
  );
};

export default Home;
