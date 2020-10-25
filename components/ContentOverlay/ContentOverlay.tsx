import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  overflow-y: auto;
  overflow-x: hidden;

  &.enter {
    opacity: 0;
    transition: opacity 500ms ease-in-out;

    &-active {
      opacity: 1;
    }

    &-done {
      opacity: 1;
    }
  }

  &.exit {
    transition: opacity 500ms ease-in-out;

    &-active {
      opacity: 0;
    }
  }
`;

const ContentOverlay: React.FC<{ hash: string }> = ({
  hash: hashProp,
  children,
}) => {
  const router = useRouter();
  const { asPath } = router;

  const [active, setActive] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    const { hash } = new URL(window.location.origin + asPath);

    setActive(hash === hashProp);
  }, [asPath, hashProp]);

  return (
    <CSSTransition
      in={active}
      appear={active}
      mountOnEnter
      unmountOnExit
      timeout={{
        enter: initialized ? 500 : 0,
        exit: 500,
      }}
    >
      <Container
        onClick={() =>
          router.push('/projects/[...project]', window.location.pathname, {
            shallow: true,
          })
        }
      >
        {children}
      </Container>
    </CSSTransition>
  );
};

export default ContentOverlay;
