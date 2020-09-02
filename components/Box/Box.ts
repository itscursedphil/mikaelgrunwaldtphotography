import styled from 'styled-components';
import {
  space,
  SpaceProps,
  color,
  ColorProps,
  typography,
  TypographyProps,
  layout,
  LayoutProps,
  flexbox,
  FlexboxProps,
  background,
  BackgroundProps,
  border,
  BorderProps,
  position,
  PositionProps,
} from 'styled-system';

const Box = styled.div<
  SpaceProps &
    ColorProps &
    TypographyProps &
    LayoutProps &
    FlexboxProps &
    BackgroundProps &
    BorderProps &
    PositionProps
>`
  ${space}
  ${color}
  ${typography}
  ${layout}
  ${flexbox}
  ${background}
  ${border}
  ${position}
`;

export default Box;
