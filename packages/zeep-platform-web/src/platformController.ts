import { Controller, createScope } from "rx-effects";

import { createWebStorageController } from './storage';
import { Platform } from 'zeep-platform/src/platform';

export function createPlatformController(): Controller<{ platform: Platform }> {
  const scope = createScope();

  const {
    localStorage,
    sessionStorage,
  } = scope.createController(() => createWebStorageController());

  return {
    platform: {
      localStorage,
      sessionStorage,
    },
    destroy: scope.destroy,
  };
}
