import { token } from 'ditox';
import { Controller, createScope } from 'rx-effects';

import { Logger, getLogger } from 'zeep-common/src/logger';

import { createLocalLocationController } from './localLocation';

export type CoreMap = {
    test: 123
}

export type CoreMapController = Controller<{
    coreMap: CoreMap;
}>;

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
        coreMap: {
            test: 123
        },
        destroy: scope.destroy,
    }
}
