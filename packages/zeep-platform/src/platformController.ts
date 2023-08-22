import { Container } from 'ditox';
import { Controller, createScope } from "rx-effects";

import { createStorageController } from './storage';
import { Platform } from './platform';

export function createPlatformController(): Controller<{ platform: Platform }> {
  const scope = createScope();

  const { storages } = scope.createController(() => createStorageController());

  return {
    platform: {
      ...storages,
    },
    destroy: scope.destroy,
  }
}
