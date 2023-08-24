import memoize from 'lodash/memoize';
import noop from 'lodash/noop';
import { Action } from 'rx-effects';
import { Observable, Subject } from 'rxjs';

import { Mutable } from './utilityTypes';
import { createCycleBuffer } from './collections';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogMetadata = Readonly<Record<string, string>>;
export type LogFunction = (...data: unknown[]) => void;

export type Logger = {
  getLogger: typeof getLogger;
  withMeta: (meta: LogMetadata) => Logger;

  debug: LogFunction;
  log: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;

  messages$: Observable<LogEvent>;
};

export type LogEvent = {
  timestamp: number;
  level: LogLevel;
  tag: string;
  messages: ReadonlyArray<unknown>;
  meta?: LogMetadata;
};let globalLogsMetadata: Mutable<LogMetadata> = Object.create(null);

export const LOGS_META = {
  set(key: string, value: string): void {
    globalLogsMetadata[key] = value;
  },

  remove(key: string): void {
    delete globalLogsMetadata[key];
  },

  clear(): void {
    globalLogsMetadata = {};
  },
};

// Cycled buffer of logger events
const LOG_BUFFER_SIZE = 1000;
const LOG_BUFFER = createCycleBuffer<LogEvent>(LOG_BUFFER_SIZE);
let LOG_BUFFER_ENABLED = true;

export function clearLogBuffer(): void {
  LOG_BUFFER.clear();
}

export function getLogBuffer(): ReadonlyArray<LogEvent> {
  return LOG_BUFFER.getItems();
}

export function enableLogBuffer(isEnabled: boolean): void {
  LOG_BUFFER_ENABLED = isEnabled;

  if (!isEnabled) {
    clearLogBuffer();
  }
} 

export const LOG_LEVEL_VALUES: ReadonlyArray<LogLevel> = [
  'debug',
  'info',
  'warn',
  'error',
];

export const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export const EMPTY_LOGGER: Logger = {
  getLogger: () => EMPTY_LOGGER,
  withMeta: () => EMPTY_LOGGER,

  debug: noop,
  log: noop,
  info: noop,
  warn: noop,
  error: noop,

  messages$: new Observable(),
};

export const logMessage: Action<LogEvent> = createLogMessageAction();

function createLogMessageAction(): Action<LogEvent> {
  const source$ = new Subject<LogEvent>();

  const emitter = (event: LogEvent): void => {
    const eventWithMeta = {
      ...event,
      meta: { ...globalLogsMetadata, ...event.meta },
    };

    if (LOG_BUFFER_ENABLED) {
      LOG_BUFFER.append(eventWithMeta);
    }

    source$.next(eventWithMeta);
  };
  emitter.event$ = source$.asObservable();

  return emitter;
}

export function getLogger(tag: string, meta?: LogMetadata): Logger {
  function getNewLog(level: LogLevel, messages: ReadonlyArray<unknown>): LogEvent {
    return {
      level,
      messages,
      timestamp: Date.now(),
      tag,
      meta,
    };
  }

  return {
    getLogger(tagSuffix, customMeta) {
      const nextTag = `${tag}.${tagSuffix}`;

      return getLogger(nextTag, { ...meta, ...customMeta });
    },
    withMeta(customMeta) {
      return getLogger(tag, { ...meta, ...customMeta });
    },

    debug(...messages) {
      logMessage(getNewLog('debug', messages));
    },
    log(...messages) {
      logMessage(getNewLog('info', messages));
    },
    info(...messages) {
      logMessage(getNewLog('info', messages));
    },
    warn(...messages) {
      logMessage(getNewLog('warn', messages));
    },
    error(...messages) {
      logMessage(getNewLog('error', messages));
    },

    messages$: logMessage.event$,
  };
}

export function createLoggerFactory(...params: Parameters<typeof getLogger>): () => Logger {
  return memoize(() => getLogger(...params));
}
