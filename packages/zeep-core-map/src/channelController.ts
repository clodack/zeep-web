import { Controller, createScope } from 'rx-effects';
import { Logger } from 'zeep-common/src/logger';

import { createWebSocketClient, WebSocketClient } from 'zeep-common/src/wsClient';

export type WSMapChannel = {
  channel?: WebSocketClient['webSocket'];
  stopChannel: () => void;
  startChannel: () =>  void;
}

export function createChannelController(params: {
  logger?: Logger;
}): Controller<WSMapChannel> {
  const scope = createScope();

  if (!process.env.ZEEP_APP_MAP_WS_URL) {
    throw new Error('map url api not defined!');
  }

  let wsClient: WebSocketClient | undefined;

  function stopChannel(): void {
    wsClient?.stopStream();
  }

  function startChannel(): WebSocketClient {
    wsClient = createWebSocketClient({
      url: process.env.ZEEP_APP_MAP_WS_URL || '',
      logger: params?.logger
    });

    return wsClient;
  }

  return {
    channel: wsClient?.webSocket,

    stopChannel,
    startChannel,

    destroy: scope.destroy,
  };
}
