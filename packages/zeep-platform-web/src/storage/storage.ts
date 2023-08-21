export type KeyValueStorage = Readonly<{
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  getKeys: () => ReadonlyArray<string>;
}>;

export type Store = {
  storage: KeyValueStorage;
  sessionStorage: KeyValueStorage;
}

export function createWebStorage(): Store {
  return {
    storage: adapterWebStorage(localStorage),
    sessionStorage: adapterWebStorage(sessionStorage),
  }
}

function adapterWebStorage(
  storage: Storage,
  keyPrefix?: string
): KeyValueStorage {
  const prefix = keyPrefix ? `${keyPrefix}.` : '';

  return {
    getItem(key) {
      return storage.getItem(prefix + key) ?? undefined;
    },

    setItem(key, value) {
      storage.setItem(prefix + key, value);
    },

    removeItem(key) {
      storage.removeItem(prefix + key);
    },

    clear() {
      if (prefix) {
        this.getKeys().forEach((key) => this.removeItem(key));
      } else {
        storage.clear();
      }
    },

    getKeys() {
      const keys = [];

      for(let i = 0; i < storage.length; i++) {
        const key = storage.key(i);

        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        }
      }

      return keys;
    }
  };
}
