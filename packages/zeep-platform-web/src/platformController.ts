import { Controller, createScope } from "rx-effects";

import { Platform } from 'zeep-platform/src/platform';
import { createHttpClient } from 'zeep-common/src/httpClient';

import { createPageLayoutController } from './pageLayout';
import { createWebStorageController } from './storage';
import { createWindowDimensionsController } from './windowSizeController';
import { getLogger } from "zeep-common/src/logger";

export function createPlatformController(): Controller<{ platform: Platform }> {
  const scope = createScope();

  const logger = getLogger('platform');

  const {
    localStorage,
    sessionStorage,
  } = scope.createController(() => createWebStorageController());

  const { dimensions } = scope.createController(() =>
    createWindowDimensionsController(),
  );

  const {
    breakpoints,
    orientation,
  } = scope.createController(() => createPageLayoutController(dimensions));

  const httpClient = scope.createController(() => createHttpClient({
    logger: logger.getLogger('httpClient')
  }));

  return {
    platform: {
      target: 'web',

      httpClient,
    
      localStorage,
      sessionStorage,

      breakpoints,
      orientation,

      windowDimensions: dimensions,
    },
    destroy: scope.destroy,
  };
}
