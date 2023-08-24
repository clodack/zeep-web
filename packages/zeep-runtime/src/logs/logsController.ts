import { Controller, createScope } from 'rx-effects';

import { logMessage } from 'zeep-common/src/logger';

import { createConsoleLogOutput } from './consoleLogOutput';

export function createLogsController(): Controller {
  const scope = createScope();

  scope.createController(() =>
    createConsoleLogOutput({
      logEvent$: logMessage.event$,
      consoleLevel: 'debug',
    }),
  );

  return {
    destroy: scope.destroy,
  };
}
