import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { layout, position, space } from 'styled-system';
import { Transition } from 'react-transition-group';

import Navigation from '../Navigation';
import Title from '../Title';
import { pointerEvents } from '../../lib/styledSystem';
import useBreakpoints from '../../hooks/useBreakpoints';
import Box from '../Box';
import GalleryNavigation from '../GalleryNavigation';

const MenuContainer = styled.header<{ inactive: boolean; open: boolean }>`
  display: flex;
  flex-direction: row;
  transition: opacity 0.6s ease-in-out, background-color 0.5s ease-in-out;
  z-index: 10;
  background-color: ${({ open }) =>
    open ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)'};
  ${() =>
    space({
      pl: [4],
      pr: [4, 4, 0],
      py: [4, 4, 5],
    })}

  ${() =>
    position({
      position: ['fixed', 'fixed', 'relative'],
      top: [0, 0, 'auto'],
      left: [0, 0, 'auto'],
    })}
  ${() =>
    layout({
      width: ['100%', '100%', '280px'],
      height: ['100%', '100%', 'inherit'],
    })}
  ${({ open }) =>
    pointerEvents({
      pointerEvents: open ? 'auto' : ['none', 'none', 'auto'],
    })}

  &:not(:hover) {
    opacity: ${({ inactive }) => (inactive ? 0.2 : 1)};
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  position: relative;
`;

interface TransitionStyles {
  entering: React.CSSProperties;
  entered: React.CSSProperties;
  exiting: React.CSSProperties;
  exited: React.CSSProperties;
}

const navTransitionStyles: TransitionStyles = {
  entering: {
    opacity: 0,
    transform: 'translateY(-1rem)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  entered: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  exiting: {
    opacity: 0,
    transform: 'translateY(1rem)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  exited: {
    opacity: 0,
    transform: 'translateY(1rem)',
    pointerEvents: 'none',
    visibility: 'hidden',
  },
};

const galleryNavTransitionStyles: TransitionStyles = {
  entering: {
    opacity: 0,
    transform: 'translateY(1rem)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  entered: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  exiting: {
    opacity: 0,
    transform: 'translateY(1rem)',
    pointerEvents: 'auto',
    visibility: 'visible',
  },
  exited: {
    opacity: 0,
    transform: 'translateY(1rem)',
    pointerEvents: 'none',
    visibility: 'hidden',
  },
};

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [inactive, setInactive] = useState(false);
  const { breakpoint } = useBreakpoints();

  const isMobile = breakpoint < 2;

  const timeoutRef = useRef<number | undefined>();
  const handleMouseMove = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInactive(false);

    timeoutRef.current = setTimeout(() => {
      setInactive(true);
    }, 4000);
  }, []);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setInactive(false);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isMobile]);

  return (
    <MenuContainer inactive={inactive} open={open}>
      <InnerContainer>
        <Box display="flex" alignItems="center" onClick={() => setOpen(!open)}>
          <Title />
        </Box>
        <Transition in={isMobile ? open : true} timeout={500}>
          {(state) => (
            <div
              style={{
                ...(initialized && isMobile
                  ? {
                      transition:
                        'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }
                  : {}),
                ...(initialized && isMobile
                  ? navTransitionStyles[state as keyof TransitionStyles]
                  : {}),
              }}
            >
              <Navigation inactive={inactive} />
            </div>
          )}
        </Transition>
        <Transition in={isMobile ? !open : true} timeout={500}>
          {(state) => (
            <GalleryNavigation
              style={{
                ...(initialized && isMobile
                  ? {
                      transition:
                        'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }
                  : {}),
                ...(initialized && isMobile
                  ? galleryNavTransitionStyles[state as keyof TransitionStyles]
                  : {}),
              }}
            />
          )}
        </Transition>
      </InnerContainer>
    </MenuContainer>
  );
};

export default Menu;
