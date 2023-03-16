import { defineStore } from "pinia";
import type { AppRouteRecordRaw } from "/@/router/types";
import { asyncRoutes, basicRoutes } from "/@/router";
import { store } from "/@/store";
// import { useUserStoreWithOut } from "/@/store/modules/user";
// const userStore = useUserStoreWithOut();
// const permissions: string[] = userStore.getPermissions;

type perm = {
  [key: string]: boolean | perm;
};

interface permissionState {
  appPermission: perm;
  modulePermission: perm;
  buttonPermission: perm;
  buttonPermissionInner: perm;
  permRouterList: AppRouteRecordRaw[];
  addRouteList: AppRouteRecordRaw[];
  lastBuildMenuTime: number;
}

export const usePermissionStore = defineStore({
  id: "app-permission",
  state: (): permissionState => ({
    appPermission: {},
    modulePermission: {},
    buttonPermission: {},
    buttonPermissionInner: {},
    permRouterList: [],
    addRouteList: [],
    // 触发菜单更新
    lastBuildMenuTime: 0,
  }),
  getters: {
    getPermRouterList(): AppRouteRecordRaw[] {
      return this.permRouterList;
    },
    getAppPermission(): perm {
      return this.appPermission;
    },
    getModulePermission(): perm {
      return this.modulePermission;
    },
    getButtonPermission(): perm {
      return this.buttonPermission;
    },
    getButtonPermissionInner(): perm {
      return this.buttonPermissionInner;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
  },
  actions: {
    setAllPermissions(permissions: string[]) {
      permissions.forEach((ele) => {
        const per = ele.split(":");
        if (per.length === 1) {
          this.appPermission[ele] = true;
        } else if (per.length === 2) {
          if (this.modulePermission[per[0]] === undefined) {
            this.modulePermission[per[0]] = {};
          }
          this.modulePermission[per[0]][per[1]] = true;
        } else if (per.length === 3) {
          if (this.buttonPermission[per[0]] === undefined) {
            this.buttonPermission[per[0]] = {};
          }
          if (this.buttonPermission[per[0]][per[1]] === undefined) {
            this.buttonPermission[per[0]][per[1]] = {};
          }
          this.buttonPermission[per[0]][per[1]][per[2]] = true;
        } else if (per.length === 4) {
          if (this.buttonPermissionInner[per[0]] === undefined) {
            this.buttonPermissionInner[per[0]] = {};
          }
          if (this.buttonPermissionInner[per[0]][per[1]] === undefined) {
            this.buttonPermissionInner[per[0]][per[1]] = {};
          }
          if (
            this.buttonPermissionInner[per[0]][per[1]][per[2]] === undefined
          ) {
            this.buttonPermissionInner[per[0]][per[1]][per[2]] = {};
          }
          this.buttonPermissionInner[per[0]][per[1]][per[2]][per[3]] = true;
        }
      });
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);

      this.permRouterList = basicRoutes.concat(accessedRoutes);
      this.addRouteList = accessedRoutes;
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}

function hasPermission(permissions: string[], route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((permission) =>
      route.meta.permissions.includes(permission)
    );
  } else {
    return true;
  }
}

function filterAsyncRoutes(
  routes: AppRouteRecordRaw[],
  permissions: string[]
): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions);
      }
      res.push(tmp);
    }
  });
  return res;
}
