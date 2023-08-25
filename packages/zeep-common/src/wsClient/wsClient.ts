import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Logger } from '../logger';
import { Controller, createScope } from 'rx-effects';

export type WebSocketClientParams = {
  logger?: Logger;
  url: string;
};

export type BaseEvent = {
  type: string;
  payload?: unknown;
}

export type WebSocketClient<T extends BaseEvent = BaseEvent> = {
  webSocket: WebSocketSubject<T>;
  stopStream: () => void;
};

export function createWebSocketClient<T extends BaseEvent = BaseEvent>(
  params: WebSocketClientParams
): Controller<WebSocketClient<T>> {
  const { logger, url } = params;

  const scope = createScope();

  const ws = webSocket<T>(url);

  let countRetry = 0;

  const subscription = ws.subscribe({
    next: (message) => {
      logger?.log('ws next message', message)
      countRetry = 0;
    },
    error: (error) => {
      logger?.error('ws error', error);
      countRetry++;

      if (countRetry > 3) {
        stopStream();
        ws.error({ reason: 'fail connect to server' });
      }
    },
    complete: () => logger?.warn('ws complete'),
  });

  scope.add(() => {
    subscription.unsubscribe();
    stopStream();
  })

  function stopStream(): void {
    ws.complete();
    ws.unsubscribe();
  }

  scope.add(() => {
    stopStream();
  })
  
  return {
    webSocket: ws,
    stopStream,

    destroy: scope.destroy,
  }
}
