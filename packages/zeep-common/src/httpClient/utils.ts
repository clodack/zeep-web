export function isPlainObject<T extends Record<string, any>>(obj: T): obj is T {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
