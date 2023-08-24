import noop from 'lodash/noop';
import { Controller, createScope } from 'rx-effects';
import { Observable } from 'rxjs';

import {
  getLogBuffer,
  LOG_LEVEL_WEIGHT,
  LogEvent,
  Logger,
  LogLevel,
} from 'zeep-common/src/logger';

export const LEVEL_TAGS: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO ',
  warn: 'WARN ',
  error: 'ERROR',
};

export type ConsoleLogOutput = Controller;

export function withConsoleOutput(logger: Logger): Logger {
  return logger.withMeta({ consoleOutput: 'true' });
}

export function createConsoleLogOutput(params: {
  logEvent$: Observable<LogEvent>;
  consoleLevel: LogLevel | undefined;
}): ConsoleLogOutput {
  const { logEvent$, consoleLevel } = params;

  const scope = createScope();

  const consoleLevelWeight = consoleLevel
    ? LOG_LEVEL_WEIGHT[consoleLevel]
    : Infinity;

  scope.handle(logEvent$, (event) => {
    if (isPrintableLogEvent(event)) {
      printToConsole(event);
    }
  });

  // Print past log events from the buffer
  const logBuffer = getLogBuffer();
  if (logBuffer.length > 0) {
    logBuffer.forEach((event) => {
      if (isPrintableLogEvent(event)) {
        printToConsole(event);
      }
    });
  }

  function isPrintableLogEvent(event: LogEvent): boolean {
    return (
      event.meta?.consoleOutput === 'true' ||
      LOG_LEVEL_WEIGHT[event.level] >= consoleLevelWeight
    );
  }

  return {
    destroy: scope.destroy,
  };
}

function printToConsole(event: LogEvent): void {
  const consoleFn = getConsoleFn(event.level);
  if (consoleFn) {
    consoleFn(`${LEVEL_TAGS[event.level]} [${event.tag}]`, ...event.messages);
  }
}

function getConsoleFn(level: LogLevel): typeof console.log {
  switch (level) {
    case 'debug':
      return console.debug;
    case 'info':
      return console.log;
    case 'warn':
      return console.warn;
    case 'error':
      return console.error;
    default: {
      return noop;
    }
  }
}
