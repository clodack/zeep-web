import { Controller, createScope } from "rx-effects";

import { Platform } from 'zeep-platform/src/platform';

import { createPageLayoutController } from './pageLayout';
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

  const {
    breakpoints,
    orientation,
  } = scope.createController(() => createPageLayoutController(dimensions));

  return {
    platform: {
      target: 'web',
    
      localStorage,
      sessionStorage,

      breakpoints,
      orientation,

      windowDimensions: dimensions,
    },
    destroy: scope.destroy,
  };
}
