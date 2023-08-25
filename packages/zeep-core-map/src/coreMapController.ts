import { token } from 'ditox';
import { Controller, createScope } from 'rx-effects';

import { Logger, getLogger } from 'zeep-common/src/logger';

import { createLocalLocationController, LocalLocationController } from './localLocation';
import { createChannelController, WSMapChannel } from './channelController';

export type CoreMap = {
  localPositionController: LocalLocationController;
  channelController: WSMapChannel;
};

export type CoreMapController = Controller<CoreMap>;

export const CORE_MAP_TOKEN = token<LocalLocationController>('coreMap');
export const CORE_MAP_CHANNEL_TOKEN = token<WSMapChannel>('coreMapChannel');

export function createCoreMapController(params?: {
  logger?: Logger;
}): CoreMapController {
  const scope = createScope();

  const logger = params?.logger ?? getLogger('Map');

  const localPositionController = scope.createController(() => createLocalLocationController({
    logger: logger.getLogger('localLocation'),
  }));

  const channelController = scope.createController(() => createChannelController({
    logger: process.env.NODE_ENV === 'development' ?  logger.getLogger('messages') : undefined,
  }));

  return {
    localPositionController,
    channelController,
    destroy: scope.destroy,
  }
}
