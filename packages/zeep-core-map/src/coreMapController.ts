import { token } from 'ditox';
import { Controller, createScope } from 'rx-effects';

import { Logger, getLogger } from 'zeep-common/src/logger';

import { createLocalLocationController, LocalLocationController } from './localLocation';

export type CoreMap = {
  localPositionController: LocalLocationController;
};

export type CoreMapController = Controller<CoreMap>;

export const CORE_MAP_TOKEN = token<CoreMap>('coreMap');

export function createCoreMapController(params?: {
  logger?: Logger;
}): CoreMapController {
  const scope = createScope();

  const logger = params?.logger ?? getLogger('Map');

  const localPositionController = scope.createController(() => createLocalLocationController({
    logger: logger.getLogger('localLocation'),
  }));

  return {
    localPositionController,
    destroy: scope.destroy,
  }
}
