import { Controller, createScope } from "rx-effects";

import { Platform } from 'zeep-platform/src/platform';

import { createWebStorageController } from './storage';
import { createWindowDimensionsController } from './windowSizeController';

export function createPlatformController(): Controller<{ platform: Platform }> {
  const scope = createScope();

  const {
    localStorage,
    sessionStorage,
  } = scope.createController(() => createWebStorageController());

  const { dimensions } = scope.createController(() =>
    createWindowDimensionsController(),
  );

  return {
    platform: {
      target: 'web',
    
      localStorage,
      sessionStorage,

      windowDimensions: dimensions,
    },
    destroy: scope.destroy,
  };
}
