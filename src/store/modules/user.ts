import type { UserInfo } from "/#/store";
import { store } from "/@/store";
import { defineStore } from "pinia";
import { getAuthCache, setAuthCache } from "/@/utils/auth";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PERMISSIONS_KEY,
  USER_INFO_KEY,
} from "/@/enums/cacheEnum";

interface UserState {
  userInfo: Nullable<UserInfo>;
  permissions: Nullable<string[]>;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  updatePasswordTime?: number | string | null;
  roleId?: string[];
  roleName?: string[];
  roles: string[] | null;
}

// interface LoginParams {
//   sysLoginName: string;
//   password: string;
//   appCode: string;
//   uuid: string;
//   codeValue: string;
// }

export const userStore = defineStore({
  id: "app-user",
  state: (): UserState => ({
    userInfo: null,
    permissions: [],
    accessToken: "",
    refreshToken: "",
    updatePasswordTime: "",
    roles: [],
  }),
  getters: {
    getAccessToken(): string {
      return this.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.accessToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
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
      setAuthCache(ACCESS_TOKEN_KEY, info);
    },
    setRefreshToken(info: string | undefined) {
      this.refreshToken = info ? info : "";
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setPermissions(info: string[] | null) {
      this.permissions = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setUpdatePasswordTime(info: number | string | null) {
      this.updatePasswordTime = info;
    },
    setRoles(info: string[] | null) {
      this.roles = info;
    },
    resetState() {
      this.userInfo = null;
      this.accessToken = "";
      this.refreshToken = "";
      this.updatePasswordTime = "";
      this.permissions = [];
      this.roles = [];
    },

    // async login(params: LoginParams): Promise<UserState | null> {
    //   try {
    //   } catch (error) {}
    // },
  },
});

// 需要在设置外使用
export function useUserStoreWithOut() {
  return userStore(store);
}
