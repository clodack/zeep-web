import { Controller, createScope, createStore, Query } from 'rx-effects';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  throttleTime,
} from 'rxjs';

import { WindowDimensions } from 'zeep-platform/src';
import { shareSingleReplay } from 'zeep-common/src/rxjs';

export type WindowDimensionsController = Controller<{
  dimensions: Query<WindowDimensions>;
}>;

export function createWindowDimensionsController(): WindowDimensionsController {
  const scope = createScope();
  const dimensions$ = createStore<WindowDimensions>(getWindowDimensions());
  
  scope.handle(
    fromEvent(window, 'resize', { passive: true })
      .pipe(throttleTime(150, undefined, { trailing: true }))
      .pipe(map(() => getWindowDimensions()))
      .pipe(distinctUntilChanged(compareWindowDimensions), shareSingleReplay()),
    (dimensions) => {
      dimensions$.set(dimensions);
    },
  );

  return {
    dimensions: dimensions$,
    destroy: scope.destroy,
  };
}

function getWindowDimensions(): WindowDimensions {
  const { innerHeight, innerWidth, outerHeight, outerWidth } = window;

  return {
    innerHeight,
    innerWidth,
    outerHeight,
    outerWidth,
  };
}

function compareWindowDimensions(
  a: WindowDimensions,
  b: WindowDimensions,
): boolean {
  return (
    a.innerHeight === b.innerHeight &&
    a.innerWidth === b.innerWidth &&
    a.outerHeight === b.outerHeight &&
    a.outerWidth === b.outerWidth
  );
}
