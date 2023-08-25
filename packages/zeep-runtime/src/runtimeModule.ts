import { declareModule, injectable } from 'ditox';

import { CORE_MAP_TOKEN, CORE_MAP_CHANNEL_TOKEN } from 'zeep-core-map/src';

import { Runtime, createRuntimeController } from './runtimeController';

export const RUNTIME_MODULE = declareModule<Runtime>({
  imports: [],
  factory: injectable(createRuntimeController),
  exports: {
    map: CORE_MAP_TOKEN,
    channel: CORE_MAP_CHANNEL_TOKEN,
  }
});
