import { Token } from './token';

export type AnyObject = Record<string, any>;
export type AnyArray = Array<any>;
export type EmptyObject = Record<string, never>;

/**
 * Checks if a value is the token
 */
export function isToken<T>(value: unknown): value is Token<T> {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'symbol' in value &&
    typeof (value as any).symbol === 'symbol'
  );
}
