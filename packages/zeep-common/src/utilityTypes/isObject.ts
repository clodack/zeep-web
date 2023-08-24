import { NonObject } from './helpers';

type OBJECT_LITERAL = '__$OBJECT_LITERAL$__';

type NOT_OBJECT_LITERAL = '__$NOT_OBJECT_LITERAL$__';

type ObjectPrecheck<T> = [T] extends [never]
  ? NOT_OBJECT_LITERAL
  : T extends object
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends NonObject | any[]
    ? NOT_OBJECT_LITERAL
    : OBJECT_LITERAL
  : NOT_OBJECT_LITERAL;

export type IsObject<T> = ObjectPrecheck<T> extends OBJECT_LITERAL
  ? true
  : false;
