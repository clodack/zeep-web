import { Controller, createScope, Query } from 'rx-effects';
import { map, throttleTime } from 'rxjs';

import { WindowDimensions } from 'zeep-platform/src';

import { getBreakpoints, getOrientation, setCssVhProperty } from './utils';
import type { PageLayoutService, Breakpoints, Orientation } from 'zeep-platform/src/pageLayout';

export function createPageLayoutController(
  dimentions$: Query<WindowDimensions>
): Controller<PageLayoutService> {
  const scope = createScope();

  const breakpoints = scope.createStore<Breakpoints>(getBreakpoints());
  const orientation = scope.createStore<Orientation>(getOrientation());

  const subscription = scope.subscribe(dimentions$.value$.pipe(
    throttleTime(150, undefined, { trailing: true }),
    map(() => {
      setCssVhProperty();

      breakpoints.set(getBreakpoints());
      orientation.set(getOrientation());
    }),
  ));

  scope.add(() => {
    subscription.unsubscribe();
  });

  return {
    breakpoints,
    orientation,

    destroy: scope.destroy,
  };
}
