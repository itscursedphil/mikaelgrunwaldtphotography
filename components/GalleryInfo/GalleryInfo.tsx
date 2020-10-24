import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

import ContentOverlay from '../ContentOverlay';

const Container = styled.div`
  ${() => space({ px: [4], py: [4] })}
`;

const TextContainer = styled.div`
  max-width: 680px;
`;

const Title = styled.h1`
  font-size: 1.8em;
  line-height: 1.4em;
  margin-top: 0;
`;

const Paragraph = styled.p`
  font-size: 0.8em;
  line-height: 1.8em;
  text-align: justify;
`;

const GalleryInfo: React.FC = () => (
  <ContentOverlay hash="#info">
    <Container>
      <TextContainer>
        <Title>Lorem ipsum dolor sit amet, consetetur sadipscing elitr</Title>
        <Paragraph>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
          amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
          amet.
        </Paragraph>
        <Paragraph>
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat.
        </Paragraph>
        <Paragraph>
          Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
          suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem
          vel eum iriure dolor in hendrerit in vulputate velit esse molestie
          consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
          accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
          delenit augue duis dolore te feugait nulla facilisi.
        </Paragraph>
      </TextContainer>
    </Container>
  </ContentOverlay>
);

export default GalleryInfo;
