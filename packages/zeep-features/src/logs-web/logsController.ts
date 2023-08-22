import { declareModule, injectable, token } from "ditox";
import { Controller, createScope } from "rx-effects";

import { logMessage } from 'zeep-common/src/logger';

export const LOGS_TOKEN = token('logs');

export function createLogsController(): Controller {
  const scope = createScope();

  scope.handle(logMessage.event$, (event) => {
    console[event.level](...event.messages);
  });

  return {
    destroy: scope.destroy,
  };
};
