import { getCommonStoragePrefix } from "/@/utils/env";
import { createS, CreateStorageParams } from "/@/utils/cache/storageCache";

export type Options = Partial<CreateStorageParams>;

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 30;

const createOption = (
  storage: Storage = sessionStorage,
  options: Options = {}
): Options => {
  return {
    storage,
    prefixKey: getCommonStoragePrefix(),
    ...options,
  };
};

export const createLocalStorage = (options: Options = {}) => {
  return createS(
    createOption(localStorage, { ...options, timeOut: DEFAULT_CACHE_TIME })
  );
  /**
   *  createS({
   *    storage: localStorage,
   *    prefixKey: getCommonStoragePrefix(),
   *    ...options,
   *  });
   */
};
export const createSessionStorage = (options: Options = {}) => {
  return createS(
    createOption(sessionStorage, { ...options, timeOut: DEFAULT_CACHE_TIME })
  );
};

export const createCookie = (options: Options = {}) => {
  return createS({ ...options, timeOut: DEFAULT_CACHE_TIME });
};
