import { BREAKPOINTS_SIZE, CSS_VH_PROPERTY } from './consts';
import {
  Breakpoints,
  BREAKPOINTS_ENUM,
  Orientation,
  ORIENTATION_ENUM,
} from 'zeep-platform/src/pageLayout';

export const VIEWPORT_HEIGHT = `calc(var(${CSS_VH_PROPERTY}, 1vh) * 100)`;

export function setCssVhProperty(): void {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty(CSS_VH_PROPERTY, `${vh}px`);
}

export function getBreakpoints(): Breakpoints {
  const width = window.innerWidth;

  if (width < BREAKPOINTS_SIZE.s) {
    return BREAKPOINTS_ENUM.XS;
  }

  if (width < BREAKPOINTS_SIZE.m) {
    return BREAKPOINTS_ENUM.S;
  }

  if (width < BREAKPOINTS_SIZE.l) {
    return BREAKPOINTS_ENUM.M;
  }

  if (width < BREAKPOINTS_SIZE.xl) {
    return BREAKPOINTS_ENUM.L;
  }

  if (width < BREAKPOINTS_SIZE.xxl) {
    return BREAKPOINTS_ENUM.XL;
  }

  return BREAKPOINTS_ENUM.XXL;
}

export function getOrientation(): Orientation {
  if (screen.orientation?.type) {
    return screen.orientation.type.includes('portrait')
      ? ORIENTATION_ENUM.VERTICAL
      : ORIENTATION_ENUM.HORIZONTAL;
  }

  return window.innerHeight > window.innerWidth
    ? ORIENTATION_ENUM.VERTICAL
    : ORIENTATION_ENUM.HORIZONTAL;
}
