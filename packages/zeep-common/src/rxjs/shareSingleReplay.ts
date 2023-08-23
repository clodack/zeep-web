import { Observable, shareReplay } from 'rxjs';

export function sharewSingleReplay<S>(): (
  source$: Observable<S>,
) => Observable<S> {
  return (source$: Observable<S>) => {
    return source$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  };
}
