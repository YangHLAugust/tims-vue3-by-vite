import { createLocalStorage, createSessionStorage } from "/@/utils/cache";
import type { storageType, dictsState } from "/#/store";
import { DICTS_KEY } from "/@/enums/cacheEnum";

const ls = createLocalStorage();
const ss = createSessionStorage();

interface BasicStore {
  [DICTS_KEY]: dictsState;
}

type BasicKey = keyof BasicStore;

function setFn(
  key: BasicKey,
  value: BasicStore[BasicKey],
  expire: number | null,
  storage: storageType = "local"
): void {
  storage === "local" ? ls.set(key, value, expire) : ss.set(key, value, expire);
}

function getFn<T>(key: BasicKey, storage: storageType = "local") {
  return (storage === "local" ? ls.get(key) : ss.get(key)) as Nullable<T>;
}

export function setDictsCache(
  key: BasicKey,
  value: BasicStore[BasicKey],
  expire: number | null,
  storage: storageType = "local"
) {
  return setFn(key, value, expire, storage);
}

export function getDictsCache<T>(
  key: BasicKey,
  storage: storageType = "local"
) {
  return getFn(key, storage) as T;
}

export function clearAuthCache(storage: storageType = "local"): void {
  storage === "local" ? ls.clear() : ss.clear();
}

export function removeCache(key: string, storage: storageType = "local") {
  return storage === "local" ? ls.remove(key) : ss.remove(key);
}

export function clearCache(): void {
  ls.clear();
  ss.clear();
}
