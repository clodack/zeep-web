/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, EffectState, mapQuery, Query } from 'rx-effects';
import { firstValueFrom, map, merge, NEVER, Observable } from 'rxjs';

import { failure, success, TypedResult } from './typedResult';

export type OptionalQueries<Queries extends Record<string, Query<unknown>>> = {
  [K in keyof Queries]: Queries[K] extends Query<infer V>
    ? Query<V | undefined>
    : never;
};

const EMPTY_EFFECT_STATE: EffectState<unknown, unknown, unknown> = {
  result$: NEVER,
  done$: NEVER,
  error$: NEVER,
  final$: NEVER,
  pending: {
    get: () => false,
    value$: NEVER,
  },
  pendingCount: {
    get: () => 0,
    value$: NEVER,
  },
};

export function noopEffectState<Event, Result, ErrorType>(): EffectState<
  Event,
  Result,
  ErrorType
> {
  return EMPTY_EFFECT_STATE as EffectState<Event, Result, ErrorType>;
}

export function queryProperty<
  State extends Record<string, unknown>,
  Key extends keyof State,
>(store: Query<State>, key: Key): Query<State[Key]> {
  return mapQuery(store, (state) => state[key]);
}

export function tryQueryProperty<
  State extends Record<string, unknown>,
  Key extends keyof State,
>(store: Query<State | undefined>, key: Key): Query<State[Key] | undefined> {
  return mapQuery(store, (state) => state?.[key]);
}

export type ActionEffect<
  Event,
  Result = void,
  ErrorType = Error,
> = Action<Event> & EffectState<Event, Result, ErrorType>;

export function createActionEffect<
  Event = void,
  Result = void,
  ErrorType = Error,
>(
  action: Action<Event>,
  state: EffectState<Event, Result, ErrorType>,
): ActionEffect<Event, Result, ErrorType> {
  const result = (event: Event): void => action(event);
  Object.assign(result, state, action);

  return result as unknown as ActionEffect<Event, Result, ErrorType>;
}

export function invokeActionEffect<
  Event = void,
  Result = void,
  ErrorType = Error,
>(
  actionEffect: ActionEffect<Event, Result, ErrorType>,
  event?: Event,
): Promise<TypedResult<Result, ErrorType>>;
export function invokeActionEffect<
  Event = void,
  Result = void,
  ErrorType = Error,
>(
  actionEffect: ActionEffect<Event, Result, ErrorType>,
  event: Event,
): Promise<TypedResult<Result, ErrorType>> {
  const resultPromise = firstValueFrom(mapEffectToTypedResult(actionEffect));

  actionEffect(event);

  return resultPromise;
}

export function mapEffectToTypedResult<Event, Result = void, ErrorType = Error>(
  effectState: EffectState<Event, Result, ErrorType>,
): Observable<TypedResult<Result, ErrorType>> {
  return merge(
    effectState.result$.pipe(
      map((result) => success<Result, ErrorType>(result)),
    ),
    effectState.error$.pipe(
      map(({ error }) => failure<Result, ErrorType>(error)),
    ),
  );
}
