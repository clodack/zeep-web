import type { MonoTypeOperatorFunction } from 'rxjs';
import { Observable } from 'rxjs';

const NOOP_OPERATOR = <T>(source$: Observable<T>): Observable<T> => source$;

export function noopOperator<T>(): MonoTypeOperatorFunction<T> {
  return NOOP_OPERATOR;
}
