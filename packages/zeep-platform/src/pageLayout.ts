import { Observable } from 'rxjs';

import { ExtractEnum } from 'zeep-common/src/utilityTypes';

export const BREAKPOINTS_ENUM = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
  XXL: 'xxl',
} as const;

export type Breakpoints = ExtractEnum<typeof BREAKPOINTS_ENUM>;

export const ORIENTATION_ENUM = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

export type Orientation = ExtractEnum<typeof ORIENTATION_ENUM>;

export type PageLayoutService = {
  breakpoints: Observable<Breakpoints>;
  orientation: Observable<Orientation>;
};
