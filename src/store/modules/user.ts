import type { UserInfo, storageType } from "/#/store";
import type { PromiseAllSuccess } from "/#/axios";
import { store } from "/@/store";
import { defineStore } from "pinia";
import { router } from "/@/router";
import { RouteRecordRaw } from "vue-router";
import { DICTS_ALL_NAME, DICTS_KEY } from "/@/enums/cacheEnum";
import { getAuthCache, setAuthCache, removeBatchCache } from "/@/utils/auth";
import { isEmpty } from "/@/utils/is";
import { setDictsCache } from "/@/utils/dicts";
import { useDictsStoreWithOut } from "/@/store/modules/dicts";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PERMISSIONS_KEY,
  USER_INFO_KEY,
} from "/@/enums/cacheEnum";
import { PageEnum } from "/@/enums/pageEnum";
import { usePermissionStoreWithOut } from "/@/store/modules/permissions";
import { LoginParams } from "/@/api/user/model/userModel";
import { loginApi } from "/@/api/user";
import { getDictItemApi } from "/@/api/dicts";
const dictsStore = useDictsStoreWithOut();
interface UserState {
  userInfo: Nullable<UserInfo>;
  permissions: Nullable<string[]>;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  updatePasswordTime?: number | string | null | undefined;
  roleId?: string[];
  roleName?: string[];
  roles: string[] | null;
}
type OmitType = "updatePasswordTime" | "tokenType" | "roleId" | "roleName";
interface CacheInfo extends Omit<UserState, OmitType> {}

export const userStore = defineStore({
  id: "app-user",
  state: (): UserState => ({
    userInfo: null,
    permissions: null,
    accessToken: "",
    refreshToken: "",
    updatePasswordTime: "",
    roles: null,
  }),
  getters: {
    getAccessToken(): string {
      return this.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getPermissions(): string[] {
      return this.permissions || getAuthCache<string[]>(PERMISSIONS_KEY) || [];
    },
    getRoles(): string[] {
      return this.roles as string[];
    },
  },
  actions: {
    setAccessToken(info: string | undefined) {
      this.accessToken = info ? info : "";
    },
    setRefreshToken(info: string | undefined) {
      this.refreshToken = info ? info : "";
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
    },
    setPermissions(info: string[] | null) {
      this.permissions = info;
    },
    setUpdatePasswordTime(info: number | string | null | undefined) {
      this.updatePasswordTime = info;
    },
    setRoles(info: string[] | null) {
      this.roles = info;
    },
    setAllUserCache(
      info: CacheInfo,
      time: number | null = null,
      storage: storageType = "local"
    ) {
      const { accessToken, refreshToken, userInfo, permissions } = info;
      setAuthCache(ACCESS_TOKEN_KEY, accessToken, time, storage);
      setAuthCache(REFRESH_TOKEN_KEY, refreshToken, time, storage);
      setAuthCache(USER_INFO_KEY, userInfo, time, storage);
      setAuthCache(PERMISSIONS_KEY, permissions, time, storage);
    },
    removeAllUserCache() {
      const arr = [
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_INFO_KEY,
        PERMISSIONS_KEY,
      ];
      removeBatchCache(arr);
    },
    resetState() {
      this.userInfo = null;
      this.accessToken = "";
      this.refreshToken = "";
      this.updatePasswordTime = "";
      this.permissions = [];
      this.roles = [];
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // if (this.getAccessToken) {
      //   try {
      //     await doLogout();
      //   } catch {
      //     console.log('注销Token失败');
      //   }
      // }
      // this.setAccessToken(undefined);
      // this.setUserInfo(null);
      // goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    async login(
      params: LoginParams & { goHome?: boolean }
    ): Promise<UserState | null> {
      try {
        const { goHome = true } = params;
        const data = await loginApi(params);
        const copyData = { ...data, userInfo: { ...data } };
        const {
          accessToken,
          refreshToken,
          permissions,
          roles,
          updatePasswordTime,
        } = copyData;
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        this.setPermissions(permissions);
        this.setRoles(roles);
        this.setUpdatePasswordTime(updatePasswordTime);
        this.setUserInfo(data);
        this.setAllUserCache(copyData);
        await this.getAllDicts();
        await this.afterLoginAction(goHome);
        return Promise.resolve(copyData);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 获取所有字典
    async getAllDicts(dictsKey?: string[]) {
      console.log("enterGetAllDicts");
      let arr = Object.values(DICTS_ALL_NAME);
      if (!isEmpty(dictsKey)) {
        arr = dictsKey;
      }
      let dictsOptions = {};
      if (arr.length) {
        const promRes = await Promise.allSettled(
          arr.map((v) => getDictItemApi(v))
        );
        promRes.forEach((item, idx) => {
          //@ts-ignore
          dictsOptions[arr[idx]] = item.value;
        });
        if (!isEmpty(dictsOptions)) {
          console.log('setCache');
          
          setDictsCache(DICTS_KEY, dictsOptions, null);
        }
      }
    },
    async afterLoginAction(goHome?: boolean) {
      if (!this.getAccessToken) return null;
      const permissionStore = usePermissionStoreWithOut();
      permissionStore.setAllPermissions(this.getPermissions as string[]);
      const routes = permissionStore.getPermRouterList;

      routes.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw);
      });
      goHome && (await router.replace(PageEnum.BASE_HOME));
    },
  },
});

// 需要在设置外使用
export function useUserStoreWithOut() {
  return userStore(store);
}
