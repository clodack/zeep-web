import { declareModule, injectable } from 'ditox';

import { CORE_MAP_TOKEN } from 'zeep-core-map/src';

import { Runtime, createRuntimeController } from './runtimeController';

export const RUNTIME_MODULE = declareModule<Runtime>({
  imports: [],
  factory: injectable(createRuntimeController),
  exports: {
    coreMap: CORE_MAP_TOKEN
  }
});
