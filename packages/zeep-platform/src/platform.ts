import { token } from 'ditox';

import { KeyValueStorage } from './storage';

export type Platform = {
  localStorage: KeyValueStorage;
  sessionStorage: KeyValueStorage;
};

export const PLATFORM_TOKEN = token<Platform>('platform');
