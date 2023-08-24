import { Controller, createScope } from 'rx-effects';

import { getLogger } from 'zeep-common/src/logger';
import { createCoreMapController, CoreMap } from 'zeep-core-map/src';

export type Runtime = {
  map: CoreMap['localPositionController'];
};

export  function createRuntimeController(): Controller<Runtime> {
  const scope = createScope();

  const logger = getLogger('Runtime');

  const { localPositionController } = scope.createController(() => createCoreMapController({ logger }));

  return {
    map: localPositionController,
    destroy: scope.destroy,
  };
}