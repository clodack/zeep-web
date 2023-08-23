import noop from 'lodash/noop';
import { Controller } from 'rx-effects';

import { KeyValueStorage } from 'zeep-platform/src';

export type Store = {
  localStorage: KeyValueStorage;
  sessionStorage: KeyValueStorage;
}

export function createWebStorageController(): Controller<Store> {
  return {
    localStorage: adapterWebStorage(localStorage),
    sessionStorage: adapterWebStorage(sessionStorage),
    destroy: noop,
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
