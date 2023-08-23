import { bindModule, createContainer } from "ditox";

import { PLATFORM_WEB_MODULE } from 'zeep-platform-web/src';
import { createZeepSDK, ZeepSDK, ZeepSDKOptions } from 'zeep-sdk-core/src';

export async function createWebZeepSDK(options?: ZeepSDKOptions): Promise<ZeepSDK> {
  const {
    container: parentContainer,
  } = options ?? {};

  const container = parentContainer ?? createContainer();

  if (!container.hasToken(PLATFORM_WEB_MODULE.token)) {
    bindModule(container, PLATFORM_WEB_MODULE, { scope: 'singleton' });
  }

  const sdk = await createZeepSDK({ ...options, container });

  return {
    container: sdk.container,
    event$: sdk.event$,
    destroy: () => {
      container.removeAll();
      sdk.destroy();
    }
  };
}
