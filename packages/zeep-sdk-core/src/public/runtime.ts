import {
  CORE_MAP_TOKEN,
  CORE_MAP_CHANNEL_TOKEN,
  LocalLocationController,
  WSMapChannel,
} from 'zeep-core-map/src';

import { ZeepSDK } from 'zeep-sdk-core/src';

export function getCoreMapModule(sdk: ZeepSDK): LocalLocationController {
  const map = sdk.container.resolve(CORE_MAP_TOKEN);

  return map;
}

export function getMapChannel(sdk: ZeepSDK): WSMapChannel {
  const channel = sdk.container.resolve(CORE_MAP_CHANNEL_TOKEN);

  return channel;
}
