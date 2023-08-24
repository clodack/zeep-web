import { IsAny } from './isAny';
import { IsObject } from './isObject';

export type ReplaceAny<T, R> = true extends IsAny<T>
  ? R
  : true extends IsObject<T>
  ? {
      [K in keyof T]: ReplaceAny<T[K], R>;
    }
  : T extends Array<infer U>
  ? Array<U> extends T
    ? Array<ReplaceAny<U, R>>
    : T
  : T;
