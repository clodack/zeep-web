// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export type EmptyObject = Record<string, never>;

export type Timestamp = number;

export type ISO8601Format = string;

/** Cross-platform reference for a timeout timer */
export type TimeoutRef = ReturnType<typeof setTimeout>;

/** Cross-platform reference for an interval timer */
export type IntervalRef = ReturnType<typeof setInterval>;

export type Undefinable<T> = T | undefined;

export type Nullable<T = never> = T | null | undefined;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonObject = number | string | boolean | Function | null | undefined;

export type ExtractEnum<T extends Record<string, string>> = T[keyof T];

export type FunctionN<A extends ReadonlyArray<unknown>, B> = {
  (...args: A): B;
};
