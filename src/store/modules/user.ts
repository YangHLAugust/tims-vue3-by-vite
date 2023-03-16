import type { UserInfo } from "/#/store";
import { store } from "/@/store";
import { defineStore } from "pinia";
import { router } from "/@/router";
import { RouteRecordRaw } from "vue-router";
import { getAuthCache, setAuthCache } from "/@/utils/auth";
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
    setUpdatePasswordTime(info: number | string | null | undefined) {
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
        const {
          accessToken,
          refreshToken,
          permissions,
          roles,
          updatePasswordTime,
        } = data;
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        this.setPermissions(permissions);
        this.setRoles(roles);
        this.setUpdatePasswordTime(updatePasswordTime);
        this.setUserInfo(data);
        await this.afterLoginAction(goHome);
        return Promise.resolve({ ...data, userInfo: data });
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async afterLoginAction(goHome?: boolean) {
      if (!this.getAccessToken) return null;
      const permissionStore = usePermissionStoreWithOut();
      permissionStore.setAllPermissions(this.permissions as string[]);
      const routes = permissionStore.getPermRouterList;
      console.log("routes", routes);

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
