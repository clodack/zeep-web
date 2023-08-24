import { Observable, shareReplay } from 'rxjs';

export function shareSingleReplay<S>(): (
  source$: Observable<S>,
) => Observable<S> {
  return (source$: Observable<S>) => {
    return source$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  };
}
