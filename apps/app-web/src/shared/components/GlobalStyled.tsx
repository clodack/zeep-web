import { FC } from 'react';

import { Link } from '@salutejs/plasma-b2c';
import {
  background,
  surfaceLiquid02,
  surfaceLiquid03,
  transparent,
} from '@salutejs/plasma-tokens-b2c';
import { light } from '@salutejs/plasma-tokens-b2c/themes';
import { b2c } from '@salutejs/plasma-tokens-b2c/typo';
import {
  compatible as compatibleTypo,
  standard as standartTypo,
} from '@salutejs/plasma-typo';

import { createGlobalStyle } from 'styled-components';

const PlasmaStyle = createGlobalStyle(light, compatibleTypo, b2c, standartTypo);


const ScrollBarsStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 16px;
    backround-color: ${transparent};
    border-radius: 0;
  }

  ::-webkit-scrollbar-corner {
    backround-color: ${transparent};
  }

  ::-webkit-scrollbar:hover {
    backround-color: ${transparent};
  }

  ::-webkit-scrollbar-thumb {
    &:vertical {
      min-height: 10px;
    }

    &:horizontal {
      min-width: 10px;
    }

    &:vertical,
    &:horizontal {
      background-color: ${surfaceLiquid02};
      border-radius: 8px;
      background-clip: padding-box;
      border: 4px solid ${transparent};

      &:active,
      &:hover {
        background-color: ${surfaceLiquid03};
      }
    }
  }
`;

const LayoutStyle = createGlobalStyle`
  html {
    overflow-x: hidden;
    background-color: ${background};
    min-height: var(--app-height, 100%);
    scrollbar-color: ${surfaceLiquid02};
    font-family: var(--plasma-typo-bofy-l-font-family);
  }

  body {
    margin: 0;
    min-height: var(--app-height, 100%);

    &:-webkit-full-screen {
      background: ${background};
    }
  }

  ${Link} {
    &:before {
      display: none;
    }
  }
`;

export const GlobalStyles: FC = () => {
  return (
    <>
      <PlasmaStyle />
      <LayoutStyle />
      <ScrollBarsStyle />
    </>
  );
}
