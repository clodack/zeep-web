export function mapToArray<K, V, R>(
  map: ReadonlyMap<K, V>,
  mapper: (value: V, key: K) => R,
): Array<R> {
  const result = [];

  for (const [key, value] of map.entries()) {
    result.push(mapper(value, key));
  }

  return result;
}

export function mapToMap<K, V, R>(
  map: ReadonlyMap<K, V>,
  mapper: (value: V, key: K) => R,
): Map<K, R> {
  const result = new Map<K, R>();

  for (const [key, value] of map.entries()) {
    result.set(key, mapper(value, key));
  }

  return result;
}

export function filterBoolean<V, T extends V | undefined | null | false | ''>(
  items: ReadonlyArray<T>
): Array<V> {
  return items.filter(Boolean) as Array<V>;
}

export type CycleBuffer<T> = Readonly<{
  append: (item: T) => void;
  clear: () => void;
  getItems: () => ReadonlyArray<T>;
}>;

export function createCycleBuffer<T>(size: number): CycleBuffer<T> {
  let buffer: T[] | undefined;
  let currentIndex = -1;
  let isOverField = false;

  return {
    append(item) {
      if (!buffer) {
        buffer = new Array(size);
      }

      isOverField = isOverField || currentIndex + 1 === size;
      currentIndex = (currentIndex + 1) % size;

      buffer[currentIndex] = item;
    },

    clear() {
      buffer = undefined;
      currentIndex = -1;
      isOverField = false;
    },

    getItems() {
      if (!buffer || currentIndex < 0) {
        return [];
      }

      const firstPart = isOverField ? buffer.slice(currentIndex + 2) : [];
      const lastPart = buffer.slice(0, currentIndex + 1);

      return [...firstPart, ...lastPart];
    }
  };
}
