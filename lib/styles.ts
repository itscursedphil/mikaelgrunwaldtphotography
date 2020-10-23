/* eslint-disable import/prefer-default-export */
import { css } from 'styled-components';
import { space } from 'styled-system';

export const innerSpace = css`
  ${() =>
    space({
      px: [4],
      py: [5],
    })}
`;
