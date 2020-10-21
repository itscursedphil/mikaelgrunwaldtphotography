import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

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
    items: [
      {
        to: '#',
        label: 'Lorem',
      },
      {
        to: '#',
        label: 'Ipsum',
      },
      {
        to: '#',
        label: 'Dolor',
      },
      {
        to: '#',
        label: 'Sit Amet',
      },
    ],
  },
  {
    to: '#',
    label: 'About',
  },
];

const NavigationContainer = styled.nav``;

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

  > a,
  > span {
    &,
    &:visited,
    &:active {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.4);
      text-decoration: none;
      transition: all 0.1s ease-in-out;
    }

    &:hover,
    &:focus {
      color: rgba(0, 0, 0, 1);
    }
  }

  ${NavigationList} {
    ${() =>
      space({
        pl: [3],
      })}
  }
`;

const Navigation: React.FC = () => (
  <NavigationContainer>
    <NavigationList>
      {navigationItems.map(({ to, label, items }) => (
        <NavigationListItem key={label}>
          <a href={to} title={label}>
            <span>{label}</span>
          </a>
          {items && (
            <NavigationList>
              {items.map((item) => (
                <NavigationListItem key={item.label}>
                  <a href={item.to} title={item.label}>
                    <span>{item.label}</span>
                  </a>
                </NavigationListItem>
              ))}
            </NavigationList>
          )}
        </NavigationListItem>
      ))}
    </NavigationList>
  </NavigationContainer>
);

export default Navigation;
