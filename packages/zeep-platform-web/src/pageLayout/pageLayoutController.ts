import { Controller, createScope, Query } from 'rx-effects';
import { map, throttleTime } from 'rxjs';

import { WindowDimensions } from 'zeep-platform/src';

import { getBreakpoints, getOrientation, setCssVhProperty } from './utils';
import type { PageLayoutService } from 'zeep-platform/src/pageLayout';

export function createPageLayoutController(
  dimentions$: Query<WindowDimensions>
): Controller<PageLayoutService> {
  const scope = createScope();

  const layout$ = dimentions$.value$.pipe(
    throttleTime(150, undefined, { trailing: true }),
    map(() => {
      setCssVhProperty();

      return {
        breakpoints: getBreakpoints(),
        orientation: getOrientation(),
      };
    }),
  );

  return {
    breakpoints: layout$.pipe(map(({ breakpoints }) => breakpoints)),
    orientation: layout$.pipe(map(({ orientation }) => orientation)),

    destroy: scope.destroy,
  };
}
