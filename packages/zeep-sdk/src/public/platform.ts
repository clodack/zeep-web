import { PLATFORM_MODULE, Platform, PLATFORM_TOKEN } from 'zeep-platform/src';

import { ZeepSDK } from '../sdk';

export function getPlatformModule(sdk: ZeepSDK): Platform {
  const platform = sdk.container.resolve(PLATFORM_TOKEN);

  return platform;
}
