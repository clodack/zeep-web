import { token } from 'ditox';
import { Query } from 'rx-effects';

import { Breakpoints, Orientation } from './pageLayout';
import { KeyValueStorage } from './storage';
import { WindowDimensions } from './windowDimensions';

export type Target = 'web' | 'desktop' | 'mobile';

export type Platform = {
  target: Target;

  localStorage: KeyValueStorage;
  sessionStorage: KeyValueStorage;

  breakpoints: Query<Breakpoints>;
  orientation: Query<Orientation>;

  windowDimensions: Query<WindowDimensions>;
};

export const PLATFORM_TOKEN = token<Platform>('platform');
