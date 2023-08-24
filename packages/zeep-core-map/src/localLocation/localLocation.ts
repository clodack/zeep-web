import { Controller, createScope, Query } from 'rx-effects';
import { Observable } from 'rxjs';

import { createEventBus } from 'zeep-common/src/events';

import {
  getEmptyLocationCoordinates,
  handlePermission,
} from './utils';
import { Logger } from 'zeep-common/src/logger';

export type Event = Readonly<
  | {
      type: 'changeLocationPermitions';
      payload: {
        status: PermissionState;
      },
    }
  | {
    type: 'changeLocations';
    payload: {
      coords: GeolocationCoordinates;
    }
    }
  | {
      type: 'errorReadLocation',
      payload: {
        error: GeolocationPositionError
      }
    }
>;

export type LocalLocationController = {
  event$: Observable<Event>;

  coords: Query<GeolocationCoordinates>;
  permitionsState: Query<PermissionState>;
}

export function createLocalLocationController(params: {
  logger: Logger;
}): Controller<LocalLocationController> {
  const scope = createScope();

  const { logger } = params;

  const position$ = scope.createStore<GeolocationCoordinates>(getEmptyLocationCoordinates());
  const idWatcher$ = scope.createStore<number>(-1);
  const eventBus = createEventBus<Event>();

  let permitions$ = handlePermission();

  scope.handle(permitions$, (permitions) => {
    eventBus({
      type: 'changeLocationPermitions',
      payload: { status: permitions }
    });

    if (permitions === 'granted' || permitions === 'prompt') {
      logger.info(`Permitions granted ${permitions}`);
      idWatcher$.set(startWatchPosition());
    }

    if (permitions === 'denied') {
      logger.warn('Permitions denied');

      stopWatchPositions();
      idWatcher$.set(startWatchPosition());
    }
  });

  function startWatchPosition(): number {
    return navigator.geolocation.watchPosition(
      successGetLocation,
      errorGetLocation,
    );
  }

  function stopWatchPositions(): void {
    const id = idWatcher$.get();

    if (id !== -1) {
      navigator.geolocation.clearWatch(id);
      idWatcher$.set(-1);
    }
  }

  function successGetLocation(position: GeolocationPosition): void {
    position$.set(position.coords);
    
    eventBus({
      type: 'changeLocations',
      payload: { coords: position.coords },
    });
  }

  function errorGetLocation(positionError: GeolocationPositionError): void {
    logger.error('Error get location', positionError);

    eventBus({
      type: 'errorReadLocation',
      payload: { error: positionError },
    });

    permitions$ = handlePermission();
  }

  scope.add(() => {
    stopWatchPositions();
  });

  return {
    event$: eventBus.event$,

    coords: position$,
    permitionsState: permitions$,

    destroy: scope.destroy,
  }
}
