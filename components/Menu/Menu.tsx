import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { layout } from 'styled-system';

import { innerSpace } from '../../lib/styles';
import Box from '../Box';
import Navigation from '../Navigation';
import Title from '../Title';

const MenuContainer = styled.header<{ inactive: boolean }>`
  display: flex;
  flex-direction: row;
  transition: opacity 0.6s ease-in-out;
  ${innerSpace}
  padding-right: 0;

  ${() =>
    layout({
      width: ['280px'],
    })}

  &:not(:hover) {
    opacity: ${({ inactive }) => (inactive ? 0.2 : 1)};
  }
`;

const Menu: React.FC = ({ children }) => {
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
      <Box position="relative" width={1}>
        <Title />
        <Navigation inactive={inactive} />
        {children}
      </Box>
    </MenuContainer>
  );
};

export default Menu;
