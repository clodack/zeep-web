import { Controller, createScope } from 'rx-effects';

import { createLogsController } from './logs';

export function createWebRuntimeController(): Controller {
  const scope = createScope();

  scope.createController(() => createLogsController());

  return {
    destroy: scope.destroy,
  }
}
