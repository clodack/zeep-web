import { CORE_MAP_TOKEN, LocalLocationController } from 'zeep-core-map/src';

import { ZeepSDK } from 'zeep-sdk-core/src';

export function getCoreMapModule(sdk: ZeepSDK): LocalLocationController {
  const map = sdk.container.resolve(CORE_MAP_TOKEN);

  return map;
}
