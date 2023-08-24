import { token } from 'ditox';
import { Query } from 'rx-effects';

import { KeyValueStorage } from './storage';
import { WindowDimensions } from './windowDimensions';

export type Target = 'web' | 'desktop' | 'mobile';

export type Platform = {
  target: Target;

  localStorage: KeyValueStorage;
  sessionStorage: KeyValueStorage;

  windowDimensions: Query<WindowDimensions>;
};

export const PLATFORM_TOKEN = token<Platform>('platform');
