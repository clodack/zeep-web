import { Controller, createScope } from "rx-effects";

import { Platform } from 'zeep-platform/src/platform';
import { createHttpClient } from 'zeep-common/src/httpClient';
import { getLogger } from "zeep-common/src/logger";

import { createPageLayoutController } from './pageLayout';
import { createWebStorageController } from './storage';
import { createWindowDimensionsController } from './windowSizeController';
import { createVideoController } from "./video";

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

  const video = scope.createController(() => createVideoController());

  return {
    platform: {
      target: 'web',

      httpClient,

      video,
    
      localStorage,
      sessionStorage,

      breakpoints,
      orientation,

      windowDimensions: dimensions,
    },
    destroy: scope.destroy,
  };
}
