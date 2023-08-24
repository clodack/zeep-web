import { Controller, createScope } from 'rx-effects';

import { getLogger } from 'zeep-common/src/logger';
import { createCoreMapController, CoreMap } from 'zeep-core-map/src';

export type Runtime = {
    coreMap: CoreMap;
};

export  function createRuntimeController(): Controller<Runtime> {
    const scope = createScope();

    const logger = getLogger('Runtime');

    const { coreMap } = scope.createController(() => createCoreMapController({ logger }));

    return {
        coreMap,
        destroy: scope.destroy,
    };
}