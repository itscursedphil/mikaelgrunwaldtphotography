import styled from 'styled-components';
import { space, SpaceProps, width, WidthProps } from 'styled-system';

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  ${() => space({ mx: -3 })}
`;

export type GridItemProps = WidthProps & SpaceProps;

export const GridItem = styled.div<GridItemProps>`
  flex-shrink: 0;
  ${width}
  ${({ width: widthProp, ...spaceProps }) =>
    space({ px: 3, mb: 3, ...spaceProps })}
`;
