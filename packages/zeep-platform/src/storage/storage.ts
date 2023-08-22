import { Controller } from "rx-effects";
import noop from 'lodash/noop';

import { createWebStorage } from 'zeep-platform-web/src';
import { declareModule, token, Module, injectable } from "ditox";

export type Storage = Readonly<{
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}>;

export type Storages = Readonly<{
  localStorage: Storage;
  sessionStorage: Storage;
}>;

export type StoragesModule = Readonly<{ storages: Storages }>;

const noopStorage: Storage = {
  getItem: () => undefined,
  setItem: noop,
  removeItem: noop,
  clear: noop,
}

export const PLATFORM_STORAGE_TOKEN = token<Storages>('platformStorage');
export const PLATFORM_STORAGE_MODULE = declareModule<Module<StoragesModule>>({
  imports: [],
  factory: injectable(createStorageController),
  exports: {
    storages: PLATFORM_STORAGE_TOKEN,
  },
})

export function createStorageController(): Controller<StoragesModule> {
  if (process.env?.ENV_TARGET === 'web') {
    return {
      storages: createWebStorage(),
      destroy: noop,
    }
  }

  return {
    storages: {
      localStorage: noopStorage,
      sessionStorage: noopStorage,
    },
    destroy: noop,
  };
}
