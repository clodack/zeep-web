export type TypedResult<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export function success<T, E = Error>(value: T): TypedResult<T, E> {
  return { success: true, value };
}

export function failure<T, E = Error>(error: E): TypedResult<T, E> {
  return { success: false, error };
}

export function getResult<T, E>(result: TypedResult<T, E>): T {
  if (result.success) {
    return result.value;
  }
  throw result.error;
}

export function throwOnError<E>(result: TypedResult<unknown, E>): void {
  if (!result.success) {
    throw result.error;
  }
}

export function tryGetResult<T, E, R extends T | undefined>(
  result: TypedResult<T, E>,
  defaultValue?: T,
): R;
export function tryGetResult<T, E>(
  result: TypedResult<T, E>,
  defaultValue: T,
): T {
  return result.success ? result.value : defaultValue;
}

export function getFailure<E>(
  result: TypedResult<unknown, E> | undefined,
): E | undefined {
  return result?.success ? undefined : result?.error;
}

export function isSuccess<T, E>(
  result: TypedResult<T, E>,
): result is { success: true; value: T } {
  return result.success;
}

export function isFailure<T, E>(
  result: TypedResult<T, E>,
): result is { success: false; error: E } {
  return !result.success;
}

export function getTypedResult<T, E = Error>(
  action: () => T,
): TypedResult<T, E> {
  try {
    return success(action());
  } catch (error) {
    return failure(error as E);
  }
}

export async function promiseTypedResult<T, E = Error>(
  promise: Promise<T>,
): Promise<TypedResult<T, E>>;

export async function promiseTypedResult<T, E = Error>(
  action: () => Promise<T>,
): Promise<TypedResult<T, E>>;

export async function promiseTypedResult<T, E = Error>(
  actionOrPromise: Promise<T> | (() => Promise<T>),
): Promise<TypedResult<T, E>> {
  try {
    const result =
      typeof actionOrPromise === 'function'
        ? await actionOrPromise()
        : await actionOrPromise;

    return success(result);
  } catch (error) {
    return failure(error as E);
  }
}

export function mapSuccess<T, R, E>(
  source: TypedResult<T, E>,
  mapper: (value: T) => R,
): TypedResult<R, E> {
  return isSuccess(source) ? success(mapper(source.value)) : source;
}
