import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { layout } from 'styled-system';

import { innerSpace } from '../../lib/styles';
import Navigation from '../Navigation';
import Title from '../Title';

const MenuContainer = styled.header<{ inactive: boolean }>`
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

const Menu: React.FC = () => {
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
    <MenuContainer inactive={inactive}>
      <Title />
      <Navigation />
    </MenuContainer>
  );
};

export default Menu;
