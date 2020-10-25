import { useRouter } from 'next/dist/client/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { space } from 'styled-system';
import useProjects from '../../hooks/useProjects';

import { Project } from '../../lib/projectsContext';
import { Theme } from '../../theme';

interface NavigationItem {
  to: string;
  label: string;
  items?: NavigationItem[];
}

const createNavigationItems = (projects: Project[]): NavigationItem[] => {
  return [
    {
      to: '/portfolio',
      label: 'Portfolio',
    },
    {
      to: '/projects',
      label: 'Projects',
      items: projects.map(({ label, slug }) => ({
        to: `/projects/${slug}`,
        label,
      })),
    },
    {
      to: '/about',
      label: 'About',
    },
  ];
};

const NavigationContainer = styled.nav`
  opacity: 0;
  pointer-events: none;
  visibility: hidden;

  &.enter {
    opacity: 0;
    transform: translateY(-1rem);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

    &-active,
    &-done {
      opacity: 1;
      transform: translateY(0);
    }

    &,
    &-active,
    &-done {
      pointer-events: auto;
      visibility: visible;
    }
  }

  &.exit {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    pointer-events: auto;
    visibility: visible;

    &-active,
    &-done {
      opacity: 0;
      transform: translateY(1rem);
    }

    &-done {
      pointer-events: none;
      visibility: hidden;
    }
  }

  ${({ theme }: { theme: Theme }) => css`
    @media screen and (min-width: ${theme.breakpoints[1]}) {
      &,
      &.enter,
      &.exit {
        &,
        &-active,
        &-done {
          transition: all 0s;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          visibility: visible;
        }
      }
    }
  `}
`;

const NavigationListItem = styled.li<{ active?: boolean; subItem?: boolean }>`
  font-size: 0.8rem;
  line-height: 1.6rem;
  margin: 0;
  padding: 0;
  position: relative;

  > a,
  > span {
    &,
    &:visited,
    &:active {
      cursor: pointer;
      color: ${({ active }) =>
        active ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.4)'};
      text-decoration: none;
      transition: all 0.1s ease-in-out;

      ${({ subItem, active }) =>
        subItem &&
        css`
          ${() =>
            space({
              ml: [2],
              pl: ['2em'],
            })}

          &:before {
            content: '';
            display: block;
            width: 1.2em;
            height: 0;
            border-bottom: 1px solid black;
            position: absolute;
            top: 0.9em;
            left: 0.8em;
            opacity: ${active ? 1 : 0.4};
            transform-origin: left;
            transform: scaleX(0.8);
            transition: all 0.2s ease-in-out;
          }
        `}
    }

    &:hover,
    &:focus {
      color: rgba(0, 0, 0, 1);

      &:before {
        transform: scaleX(1);
        opacity: 1;
      }
    }
  }
`;

const NavigationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
`;

const Navigation: React.FC<{ inactive: boolean }> = ({ inactive }) => {
  const router = useRouter();
  const { projects } = useProjects();

  const navigationItems = createNavigationItems(projects);
  const navigationItemsWithChildren = navigationItems.filter(
    ({ items }) => !!items
  );
  const navigationItemsWithChildrenRefs = useRef<HTMLUListElement[] | null[]>(
    navigationItemsWithChildren.map(() => null)
  );

  const [initialized, setInitialized] = useState(false);
  const [activeStates, setActiveStates] = useState(
    navigationItemsWithChildren.map(({ to }) => router.asPath.includes(to))
  );

  const handleToggleActiveStates = useCallback(
    (index: number) => {
      setActiveStates(
        activeStates.map((state, i) => (index === i ? !state : state))
      );
    },
    [activeStates]
  );

  const getNavigationItemWithChildrenIndex = (index: number): number =>
    navigationItemsWithChildren.indexOf(
      navigationItems.find((_, i) => i === index) as NavigationItem
    );

  const getHeightForNavigationItemsWithChildren = (index: number) => {
    const active = activeStates[index];
    const item = navigationItemsWithChildrenRefs.current[index];

    if (item) {
      const height = Array.from(item.children).reduce(
        (totalHeight, child) =>
          child.getBoundingClientRect().height + totalHeight,
        0
      );

      return active ? `${height}px` : '0';
    }

    return active ? 'auto' : '0';
  };

  useEffect(() => {
    if (!initialized) setInitialized(true);
  }, [initialized]);

  return (
    <NavigationContainer>
      <NavigationList>
        {navigationItems.map(({ to, label, items }, i) => {
          const itemWithChildrenIndex = items
            ? getNavigationItemWithChildrenIndex(i)
            : -1;

          const active = !inactive && router.asPath.indexOf(to) === 0;
          const open = items ? activeStates[itemWithChildrenIndex] : false;
          const height = items
            ? getHeightForNavigationItemsWithChildren(itemWithChildrenIndex)
            : 'auto';

          return (
            <NavigationListItem key={label} active={active}>
              <a
                href={to}
                title={label}
                onClick={(e) => {
                  if (items) {
                    e.preventDefault();
                    handleToggleActiveStates(itemWithChildrenIndex);
                  }
                }}
              >
                {label}
              </a>
              {items && (
                <NavigationList
                  ref={(ref) => {
                    navigationItemsWithChildrenRefs.current[
                      itemWithChildrenIndex
                    ] = ref;
                  }}
                  style={{
                    height,
                    opacity: open ? 1 : 0,
                    transform: `translateX(${open ? 0 : '-1rem'})`,
                  }}
                >
                  {items.map((item) => {
                    const itemActive =
                      !inactive &&
                      router.asPath.indexOf(
                        item.to
                          .split('/')
                          .filter((_, idx) => idx < 3)
                          .join('/')
                      ) === 0;

                    return (
                      <NavigationListItem
                        key={item.label}
                        active={itemActive}
                        subItem
                      >
                        <a href={item.to} title={item.label}>
                          {item.label}
                        </a>
                      </NavigationListItem>
                    );
                  })}
                </NavigationList>
              )}
            </NavigationListItem>
          );
        })}
      </NavigationList>
    </NavigationContainer>
  );
};

export default Navigation;
