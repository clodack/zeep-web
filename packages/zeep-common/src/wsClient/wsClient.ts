import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Logger } from '../logger';
import { Controller, createScope } from 'rx-effects';

export type WebSocketClientParams = {
  logger?: Logger;
  url: string;
};

export type WebSocketClient = {
  webSocket: WebSocketSubject<unknown>;
};

export function createWebSocketClient(params: WebSocketClientParams): Controller<WebSocketClient> {
  const { logger, url } = params;

  const scope = createScope();

  const ws = webSocket(url);

  if (logger) {
    const subscription = ws.subscribe({
      next: (message) => logger.log('ws next message', message),
      error: (error) => logger.error('ws error', error),
      complete: () => logger.warn('ws complete'),
    });

    scope.add(() => {
      subscription.unsubscribe();
    })
  }

  scope.add(() => {
    ws.complete();
    ws.unsubscribe();
  })
  
  return {
    webSocket: ws,

    destroy: scope.destroy,
  }
}
