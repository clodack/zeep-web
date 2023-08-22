import { Controller, createScope } from 'rx-effects';

import { logMessage } from 'zeep-common/src/logger';

export function createLogsController(): Controller {
  const scope = createScope();

  scope.handle(logMessage, (message) => {
    console[message.level](message.messages)
  });

  return {
    destroy: scope.destroy,
  }
}
