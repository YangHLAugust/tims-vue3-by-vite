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
type storageType = "local" | "session";

type BasicKey = keyof BasicStore;
const ls = createLocalStorage();
const ss = createSessionStorage();

function setFn(
  key: BasicKey,
  value: BasicStore[BasicKey],
  storage: storageType = "local"
): void {
  storage === "local" ? ls.set(key, value) : ss.set(key, value);
}

function getFn<T>(key: BasicKey, storage: storageType = "local") {
  return (storage === "local" ? ls.get(key) : ss.get(key)) as Nullable<T>;
}

export function setAuthCache(
  key: BasicKey,
  value: BasicStore[BasicKey],
  storage: storageType = "local"
) {
  return setFn(key, value, storage);
}

export function getAuthCache<T>(key: BasicKey, storage: storageType = "local") {
  return getFn(key, storage) as T;
}

export function clearAuthCache(storage: storageType = "local"): void {
  storage === "local" ? ls.clear() : ss.clear();
}

export function clearAuthAllCache(): void {
  ls.clear();
  ss.clear();
}
