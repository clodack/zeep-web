import { declareModule, Module, injectable, token } from 'ditox';

import { Platform } from './platform';
import { createPlatformController } from './platformController';

export type PlatformModule = Module<{ platform: Platform }>;

export const PLATFORM_TOKEN = token<Platform>('platform');

export const PLATFORM_MODULE = declareModule({
  imports: [],
  factory: injectable(createPlatformController),
  exports: {
    platform: PLATFORM_TOKEN
  }
});
