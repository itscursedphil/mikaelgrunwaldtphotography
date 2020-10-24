import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

import ContentOverlay from '../ContentOverlay';
import { Photo } from '../../data';

const Container = styled.div`
  ${() => space({ pr: 2 })}
`;

const GridContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow-y: auto;
  ${() => space({ mx: -2 })}
`;

const GridItem = styled.div`
  width: 80px;
  height: 80px;
  ${() => space({ mx: 2, mb: 2 })}

  img {
    max-width: 100%;
  }
`;

const GalleryOverview: React.FC<{ urls: Photo[]; project: string }> = ({
  urls,
  project,
}) => {
  return (
    <ContentOverlay hash="#gallery">
      <Container>
        <GridContainer>
          {urls.map(({ small }, i) => (
            <GridItem>
              <Link href={`/projects/${project}/${i + 1}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a title={`Photo ${i + 1}`}>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img src={small} alt={`Photo ${i + 1}`} />
                </a>
              </Link>
            </GridItem>
          ))}
        </GridContainer>
      </Container>
    </ContentOverlay>
  );
};

export default GalleryOverview;
