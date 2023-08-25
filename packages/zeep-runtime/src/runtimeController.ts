import { Controller, createScope } from 'rx-effects';

import { getLogger } from 'zeep-common/src/logger';
import { createCoreMapController, CoreMap, WSMapChannel } from 'zeep-core-map/src';

import { createLogsController } from './logs';

export type Runtime = {
  map: CoreMap['localPositionController'];
  channel: WSMapChannel;
};

export  function createRuntimeController(): Controller<Runtime> {
  const scope = createScope();

  const logger = getLogger('Runtime');

  const {
    localPositionController,
    channelController,
  } = scope.createController(() => createCoreMapController({ logger }));

  scope.createController(() => createLogsController());

  return {
    map: localPositionController,
    channel: channelController,
    
    destroy: scope.destroy,
  };
}