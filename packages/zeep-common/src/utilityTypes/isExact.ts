import { IsAny } from './isAny';
import { ReplaceAny } from './replaceAny';

export type isExact<T1, T2> = true extends IsAny<T1>
  ? true extends IsAny<T2>
    ? true
    : false
  : keyof T1 extends keyof T2
  ? keyof T2 extends keyof T1
    ? ReplaceAny<T1, unknown> extends infer T1U
      ? ReplaceAny<T2, unknown> extends infer T2U
        ? [T1U] extends [T2U]
          ? [T2U] extends [T1U]
            ? T1U extends number
              ? T2U extends number
                ? true
                : false
              : true extends isExact<T1U[keyof T2U], T2U[keyof T1U]>
              ? true
              : false
            : false
          : false
        : never
      : never
    : false
  : false;
