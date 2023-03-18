import { createLocalStorage, createSessionStorage } from "/@/utils/cache";
import type { UserInfo } from "/#/store";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PERMISSIONS_KEY,
  USER_INFO_KEY,
} from "/@/enums/cacheEnum";

interface BasicStore {
  [ACCESS_TOKEN_KEY]: string | number | null | undefined;
  [REFRESH_TOKEN_KEY]: string | number | null | undefined;
  [PERMISSIONS_KEY]: string[];
  [USER_INFO_KEY]: UserInfo;
}
export type storageType = "local" | "session";

type BasicKey = keyof BasicStore;
const ls = createLocalStorage();
const ss = createSessionStorage();

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

export function setAuthCache(
  key: BasicKey,
  value: BasicStore[BasicKey],
  expire: number | null,
  storage: storageType = "local"
) {
  return setFn(key, value, expire, storage);
}

export function getAuthCache<T>(key: BasicKey, storage: storageType = "local") {
  return getFn(key, storage) as T;
}

export function clearAuthCache(storage: storageType = "local"): void {
  storage === "local" ? ls.clear() : ss.clear();
}

export function removeBatchCache(
  keys: string[],
  storage: storageType = "local"
) {
  return storage === "local" ? ls.removeBatch(keys) : ss.removeBatch(keys);
}

export function removeCache(key: string, storage: storageType = "local") {
  return storage === "local" ? ls.remove(key) : ss.remove(key);
}

export function clearAuthAllCache(): void {
  ls.clear();
  ss.clear();
}

export function getToken() {
  return getAuthCache(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getAuthCache(REFRESH_TOKEN_KEY);
}
