import React from 'react';
import styled from 'styled-components';
import { space, typography } from 'styled-system';

import ContentOverlay from '../ContentOverlay';

const Container = styled.div`
  ${() => space({ pt: [4, 4, 0] })}
`;

const TextContainer = styled.div`
  max-width: 680px;
`;

const Title = styled.h1`
  ${() =>
    typography({
      fontSize: ['1.2em', '1.2em', '1.8em'],
      lineHeight: ['1.6em', '1.6em', '1.4em'],
    })}
  margin-top: -0.25em;
  font-weight: normal;
`;

const Paragraph = styled.p`
  font-size: 0.8em;
  line-height: 1.8em;
  text-align: justify;
`;

const GalleryInfo: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <ContentOverlay hash="#info">
    <Container>
      <TextContainer>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </TextContainer>
    </Container>
  </ContentOverlay>
);

export default GalleryInfo;
