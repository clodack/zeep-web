import { NonObject } from './helpers';

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type PartialProp<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

type GetOptionalKeys<T> = NonNullable<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T]
>;

export type GetOptional<T> = Pick<T, GetOptionalKeys<T>>;

export type GetRequired<T> = Omit<T, GetOptionalKeys<T>>;

export type DeepPartial<T> = T extends NonObject
  ? T
  : T extends Array<infer U>
  ? Array<{
      [K in keyof U]?: DeepPartial<U[K]>;
    }>
  : {
      [K in keyof T]?: DeepPartial<T[K]>;
    };

export type DeepRequired<N> = NonNullable<N> extends infer T
  ? T extends NonObject
    ? T
    : T extends Array<infer U>
    ? Array<{
        [K in keyof U]-?: DeepRequired<NonNullable<U[K]>>;
      }>
    : {
        [K in keyof T]-?: DeepRequired<NonNullable<T[K]>>;
      }
  : never;
