import { Controller, createScope } from 'rx-effects';

import { getLogger } from 'zeep-common/src/logger';
import { createCoreMapController, CoreMap } from 'zeep-core-map/src';

import { createLogsController } from './logs';

export type Runtime = {
  map: CoreMap['localPositionController'];
};

export  function createRuntimeController(): Controller<Runtime> {
  const scope = createScope();

  const logger = getLogger('Runtime');

  const { localPositionController } = scope.createController(() => createCoreMapController({ logger }));

  scope.createController(() => createLogsController());

  return {
    map: localPositionController,
    destroy: scope.destroy,
  };
}