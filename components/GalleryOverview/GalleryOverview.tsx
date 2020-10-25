import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { space, layout } from 'styled-system';

import ContentOverlay from '../ContentOverlay';
import { Photo } from '../../data';

const Container = styled.div`
  ${() => space({ pr: [0, 0, 2] })}
`;

const GridContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  ${() => space({ mx: -2 })}
`;

const GridItem = styled.div`
  ${() =>
    layout({
      /* width: ['85px', '85px', '80px'], */
      height: ['100px', '100px', '80px'],
    })}
  ${() => space({ mr: [2, 2, 3], mb: [2, 2, 3] })}

  img {
    max-width: 100%;
    height: 100%;
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
          {urls.map(({ small, full }, i) => (
            <GridItem>
              <Link href={`/projects/${project}/${i + 1}`} prefetch>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  title={`Photo ${i + 1}`}
                  onMouseOver={() => fetch(full)}
                  onFocus={() => fetch(full)}
                >
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
