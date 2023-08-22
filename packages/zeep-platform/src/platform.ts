import { Storage } from './storage';

export type Platform = {
  localStorage: Storage;
  sessionStorage: Storage;
};
