import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import AppsIcon from '@material-ui/icons/Apps';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotesIcon from '@material-ui/icons/Notes';
import Link from 'next/link';

import { useRouter } from 'next/dist/client/router';
import useGallery from '../../hooks/useGallery';
import { getUrlWithToggledHash, getUrlHash } from '../../lib/url';

const Container = styled.div`
  position: absolute;
  bottom: -0.25em;
  margin-top: auto;
  font-size: 0.8rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  const router = useRouter();
  const {
    index,
    urls,
    prevUrl,
    nextUrl,
    navigateBack,
    navigateForward,
  } = useGallery();

  return (
    <Container style={style || {}}>
      <ItemsContainer>
        <Link href={prevUrl} passHref shallow>
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
        <Link href={nextUrl} passHref shallow>
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
        <Link href={getUrlWithToggledHash('#info', router)} shallow passHref>
          <IconLink
            title="Open info"
            iconSize="0.9em"
            active={getUrlHash() === '#info'}
          >
            <NotesIcon />
          </IconLink>
        </Link>
        <Link href={getUrlWithToggledHash('#gallery', router)} shallow passHref>
          <IconLink title="Open gallery" active={getUrlHash() === '#gallery'}>
            <AppsIcon />
          </IconLink>
        </Link>
      </ItemsContainer>
    </Container>
  );
};

export default GalleryNavigation;
