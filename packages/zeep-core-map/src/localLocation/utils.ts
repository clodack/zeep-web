import { createStore, Query } from 'rx-effects';

export function getEmptyLocationCoordinates(): GeolocationCoordinates {
    return {
        accuracy: 14.569,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: 47.2051682,
        longitude: 38.9434194,
        speed: 0,
    };
}

export function handlePermission(): Query<PermissionState> {
  const state$ = createStore<PermissionState>('prompt');

  navigator.permissions.query({ name: "geolocation"})
    .then((result) => {
        if (state$.get() !== result.state) {
          state$.set(result.state);
        }

        result.addEventListener('changed', () => {
          state$.set(result.state);
        })
    })
    .catch((error)=> {
      console.error(error);
      state$.set('denied')
    })

  return state$;
}
