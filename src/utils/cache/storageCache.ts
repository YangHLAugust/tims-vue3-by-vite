import { isNullOrUnDef } from "/@/utils/is";
export interface CreateStorageParams {
  prefixKey: string;
  storage: Storage;
  timeOut?: Nullable<number>;
}

export const createS = ({
  prefixKey = "",
  storage = sessionStorage,
  timeOut = null,
}: Partial<CreateStorageParams> = {}) => {
  const webStorage = class webStorage {
    private storage: Storage;
    private prefixKey?: string;
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
    }
    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * Set cache
     * @param {string} key
     * @param {*} value
     * @param {*} expire Expiration time in days
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeOut) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire)
          ? new Date().getTime() + expire * 1000 * 60 * 60 * 24
          : null,
      });
      this.storage.setItem(this.getKey(key), stringData);
    }

    /**
     * Read cache
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;
      try {
        const data = JSON.parse(val);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }
    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    removeBatch(keys: string[]) {
      keys.forEach((key) => {
        this.storage.removeItem(this.getKey(key));
      });
    }

    /**
     * Delete all caches of this instance
     */
    clear(): void {
      this.storage.clear();
    }

    /**
     * 设置cookie
     * @param {string} name cookie 名称
     * @param {*} value cookie 值
     * @param {number=} expire 过期时间
     * 如果过期时间为设置，默认关闭浏览器自动删除
     * @example
     */
    setCookie(name: string, value: any, expire: number | null = timeOut) {
      document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
    }

    /**
     * 根据名字获取cookie值
     * @param name
     */
    getCookie(name: string): string {
      const cookieArr = document.cookie.split("; ");
      for (let i = 0, length = cookieArr.length; i < length; i++) {
        const kv = cookieArr[i].split("=");
        if (kv[0] === this.getKey(name)) {
          return kv[1];
        }
      }
      return "";
    }

    /**
     * 根据名字删除指定的cookie
     * @param {string} key
     */
    removeCookie(key: string) {
      this.setCookie(key, 1, -1);
    }

    /**
     * 清空cookie，使所有cookie失效
     */
    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          document.cookie = `${keys[i]}=0;expire=${new Date(0).toUTCString()}`;
        }
      }
    }
  };
  return new webStorage();
};
