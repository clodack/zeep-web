import { Query, createStore, mapQuery } from 'rx-effects';

import { PageLayoutService, Breakpoints } from 'zeep-platform/src/pageLayout';
import { BREAKPOINTS_SIZE, getBreakpoints } from 'zeep-platform-web/src/pageLayout';
import { PLATFORM_TOKEN } from 'zeep-platform/src';

import { ZeepSDK } from 'zeep-sdk-core/src';

export function getPageLayout(sdk: ZeepSDK): PageLayoutService {
  const platform = sdk.container.resolve(PLATFORM_TOKEN);

  return {
    breakpoints: platform.breakpoints,
    orientation: platform.orientation,
  }
}

export function getPageLayoutBreakpoint(sdk: ZeepSDK): Query<Breakpoints> {
  const { breakpoints } = getPageLayout(sdk);

  const state = createStore<Breakpoints>(breakpoints.get() || getBreakpoints());

  breakpoints.value$.subscribe((newState) => {
    state.set(newState);
  })

  return state;
}

export function getContainsPageLayoutBreakpoint(
  sdk: ZeepSDK,
  breakpoint: Breakpoints
): Query<boolean> {
  const currentBreakpoints = getPageLayoutBreakpoint(sdk);

  const state = createStore<boolean>(BREAKPOINTS_SIZE[breakpoint] > BREAKPOINTS_SIZE[currentBreakpoints.get()]);

  currentBreakpoints.value$.subscribe((newState) => {
    state.set(BREAKPOINTS_SIZE[breakpoint] > BREAKPOINTS_SIZE[newState])
  });

  return state;
}

export function getIsMobile(sdk: ZeepSDK): Query<boolean> {
  return getContainsPageLayoutBreakpoint(sdk, 'm');
}

export function getIsTablet(sdk: ZeepSDK): Query<boolean> {
  const smallMobile = getContainsPageLayoutBreakpoint(sdk, 'm');
  const smallDesktop = getContainsPageLayoutBreakpoint(sdk, 'xl');

  function check(): boolean {
    return !smallMobile.get() && smallDesktop.get();
  }

  const state = createStore<boolean>(check());

  smallMobile.value$.subscribe(() => state.set(check()));
  smallDesktop.value$.subscribe(() => state.set(check()));

  return state;
}

export function getIsDesktop(sdk: ZeepSDK): Query<boolean> {
  const isTablet = getContainsPageLayoutBreakpoint(sdk, 'xl');

  return mapQuery(isTablet, (isTablet) => !isTablet);
}
