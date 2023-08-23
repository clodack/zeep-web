import { declareModule, injectable } from 'ditox';

import { PLATFORM_TOKEN } from 'zeep-platform/src';
import { createPlatformController } from './platformController';

export const PLATFORM_WEB_MODULE = declareModule({
  imports: [],
  factory: injectable(createPlatformController),
  exports: {
    platform: PLATFORM_TOKEN
  }
});
