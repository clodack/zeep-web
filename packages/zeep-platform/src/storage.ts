export type KeyValueStorage = Readonly<{
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  getKeys: () => ReadonlyArray<string>;
}>;

