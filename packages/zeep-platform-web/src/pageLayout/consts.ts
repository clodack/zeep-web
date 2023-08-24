import { token } from 'ditox';

import { PageLayoutService } from 'zeep-platform/src/pageLayout';

export const PAGE_LAYOUT_SERVICE_TOKEN = token<PageLayoutService>();

export const BREAKPOINTS_SIZE = {
  xs: 0,
  s: 320,
  m: 560,
  l: 770,
  xl: 960,
  xxl: 1200,
} as const;

const makeMedia = <T extends number>(min: T): `(min-width: ${T}px)` =>
  `(min-width: ${min}px)`;

export const MEDIA_BREAKPOINTS = {
  xs: makeMedia(BREAKPOINTS_SIZE.xs),
  s: makeMedia(BREAKPOINTS_SIZE.s),
  m: makeMedia(BREAKPOINTS_SIZE.m),
  l: makeMedia(BREAKPOINTS_SIZE.l),
  xl: makeMedia(BREAKPOINTS_SIZE.xl),
  xxl: makeMedia(BREAKPOINTS_SIZE.xxl),
} as const;

export const CSS_VH_PROPERTY = '--jazz-web-stable-vh-property';
