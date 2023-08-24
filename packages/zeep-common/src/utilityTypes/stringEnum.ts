/** Autocomplete for string union with ability use any string
 * e.g. 'apple' | 'banana' | string
 *
 * WARNING: doesn't work as object key with empty default value
 * following code will throw type error:
 * const obj1: Record<Autocomplete<'foo' | 'bar'>, any> = {}
 */
export type StringEnum<Enum extends string> =
  | Enum
  | (string & Record<never, never>);

export type FromStringEnum<Enum> = Enum extends StringEnum<infer Value>
  ? Value
  : never;
