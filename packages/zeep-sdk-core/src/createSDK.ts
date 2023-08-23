import { createContainer, Container, token } from "ditox";
import { Controller, createScope } from 'rx-effects';
import { Observable } from "rxjs";
import { enableMapSet } from 'immer';

import { createEventBus } from 'zeep-common/src/events'
import { Platform, PLATFORM_TOKEN } from 'zeep-platform/src';

enableMapSet();

export type ZeepSDK = Controller<{
  container: Container;
  event$: Observable<unknown>;
}>

export type ZeepSDKOptions = {
  container?: Container;
}

export type ZeepSDKContext = {
  platform: Platform;
}

export const ZEEP_SDK_CONTEXT_TOKEN = token<ZeepSDKContext>('ZeepSDKContext');

export async function createZeepSDK(options?: ZeepSDKOptions): Promise<ZeepSDK> {
  const {
    container: parentContainer,
  } = options ?? {};

  const scope = createScope();
  const container = parentContainer ?? createContainer();
  const eventBus = createEventBus();

  const sdk: ZeepSDK = {
    container,
    event$: eventBus.event$,
    destroy: scope.destroy,
  }

  const platform = container.resolve(PLATFORM_TOKEN);

  container.bindValue(ZEEP_SDK_CONTEXT_TOKEN, {
    platform,
  });

  return sdk;
}