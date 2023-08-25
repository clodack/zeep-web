import { useObservable } from 'rx-effects-react';

import { PageLayoutService, Breakpoints } from 'zeep-platform/src/pageLayout';
import { BREAKPOINTS_SIZE, getBreakpoints } from 'zeep-platform-web/src/pageLayout';
import { PLATFORM_TOKEN } from 'zeep-platform/src';

import { ZeepSDK } from 'zeep-sdk-core/src';

export function usePageLayout(sdk: ZeepSDK): PageLayoutService {
  const platform = sdk.container.resolve(PLATFORM_TOKEN);

  return {
    breakpoints: platform.breakpoints,
    orientation: platform.orientation,
  }
}

export function usePageLayoutBreakpoint(sdk: ZeepSDK): Breakpoints {
  const { breakpoints } = usePageLayout(sdk);

  return useObservable(breakpoints.value$, getBreakpoints());
}

export function useContainsPageLayoutBreakpoint(
  sdk: ZeepSDK,
  breakpoint: Breakpoints
): boolean {
  const currentBreakpoints = usePageLayoutBreakpoint(sdk);

  return BREAKPOINTS_SIZE[breakpoint] > BREAKPOINTS_SIZE[currentBreakpoints];
}

export function useIsMobile(sdk: ZeepSDK): boolean {
  return useContainsPageLayoutBreakpoint(sdk, 'm');
}

export function useIsTablet(sdk: ZeepSDK): boolean {
  const isMobile = useContainsPageLayoutBreakpoint(sdk, 'm');
  const isTablet = useContainsPageLayoutBreakpoint(sdk, 'l');

  return !isMobile && isTablet;
}

export function useIsDesktop(sdk: ZeepSDK): boolean {
  const isTablet = useContainsPageLayoutBreakpoint(sdk, 'l');

  return !isTablet;
}
