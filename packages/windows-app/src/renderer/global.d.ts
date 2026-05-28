import type { LhkApi } from '../preload/preload';

declare global {
  interface Window {
    lhk: LhkApi;
  }
}

export {};
