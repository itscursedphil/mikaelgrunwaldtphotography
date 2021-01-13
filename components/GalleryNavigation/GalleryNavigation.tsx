import React from 'react';
import styled, { css } from 'styled-components';
import { space } from 'styled-system';
import AppsIcon from '@material-ui/icons/Apps';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotesIcon from '@material-ui/icons/Notes';
import Link from 'next/link';

import { useRouter } from 'next/dist/client/router';
import useGallery from '../../hooks/useGallery';
import { getUrlWithToggledHash, getUrlHash } from '../../lib/url';
import { Theme } from '../../theme';

const Container = styled.div`
  margin-bottom: -0.25em;
  font-size: 0.8rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;

  &.enter {
    opacity: 0;
    transform: translateY(1rem);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

    &-active,
    &-done {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &.exit {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

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

const ItemsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconLink = styled.a<{ iconSize?: string; active?: boolean }>`
  color: black;
  line-height: 0;

  svg {
    width: ${({ iconSize }) => iconSize || '0.8em'};
    height: 0.8em;
    line-height: 0;
    transition: opacity 0.2s ease-in-out;
    opacity: ${({ active }) => (active ? 1 : 0.4)};
    ${() => space({ mx: 1 })}
  }

  &:first-child svg {
    margin-left: 0;
  }

  &:last-child svg {
    margin-right: 0;
  }

  &:hover svg,
  &:focus svg {
    opacity: 1;
  }
`;

const Info = styled.span`
  text-align: center;
  min-width: 3.5rem;
`;

const GalleryNavigation: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const { pathname, asPath } = useRouter();

  const {
    index,
    urls,
    description,
    prevUrl,
    nextUrl,
    navigateBack,
    navigateForward,
  } = useGallery();

  return (
    <Container style={style || {}}>
      <ItemsContainer>
        <Link href={pathname} as={prevUrl} passHref shallow>
          <IconLink
            onClick={(e) => {
              e.preventDefault();
              navigateBack();
            }}
            title="Previous image"
          >
            <ChevronLeftIcon />
          </IconLink>
        </Link>
        <Info>
          {index + 1} / {urls.length}
        </Info>
        <Link href={pathname} as={nextUrl} passHref shallow>
          <IconLink
            onClick={(e) => {
              e.preventDefault();
              navigateForward();
            }}
            title="Next image"
          >
            <ChevronRightIcon />
          </IconLink>
        </Link>
      </ItemsContainer>
      <ItemsContainer>
        {description && (
          <Link
            href={pathname}
            as={getUrlWithToggledHash(asPath, '#info')}
            shallow
            passHref
          >
            <IconLink
              title="Open info"
              iconSize="0.9em"
              active={getUrlHash(asPath) === '#info'}
            >
              <NotesIcon />
            </IconLink>
          </Link>
        )}
        <Link
          href={pathname}
          as={getUrlWithToggledHash(asPath, '#gallery')}
          shallow
          passHref
        >
          <IconLink
            title="Open gallery"
            active={getUrlHash(asPath) === '#gallery'}
          >
            <AppsIcon />
          </IconLink>
        </Link>
      </ItemsContainer>
    </Container>
  );
};

export default GalleryNavigation;
