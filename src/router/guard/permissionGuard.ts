import type { Router } from "vue-router";
import { useUserStoreWithOut } from "/@/store/modules/user";
import { usePermissionStoreWithOut } from "/@/store/modules/permissions";
import { PageEnum } from "/@/enums/pageEnum";
import { RouteRecordRaw } from "vue-router";
import { router as _router } from "/@/router";
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getAccessToken;
    const whitePathList: PageEnum[] = [
      PageEnum.RESET_PSW,
      PageEnum.BASE_LOGIN,
      PageEnum.FIND_PSW,
    ];
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === PageEnum.BASE_LOGIN && token) {
        try {
          await userStore.afterLoginAction();
          next((to.query?.redirect as string) || "/");
          return;
        } catch {}
      }
      next();
      return;
    }

    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true 您可以在未经许可的情况下访问。您需要将路由meta.ignoreAuth设置为true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // redirect login page
      const redirectData: {
        path: string;
        replace: boolean;
        query?: Recordable<string>;
      } = {
        path: PageEnum.BASE_LOGIN,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    const routes = permissionStore.getPermRouterList;
    if (routes?.length <= 2) {
      // 浏览器刷新，重新获取路由
      // const permissions = userStore.getPermissions;
      // permissionStore.setAllPermissions(permissions as string[]);
      // const routes = permissionStore.getPermRouterList;
      // routes.forEach((route) => {
      //   _router.addRoute(route as unknown as RouteRecordRaw);
      // });
      await userStore.afterLoginAction();
      const redirectPath = (from.query.redirect || to.path) as string;
      const nextData =
        to.path === redirectPath
          ? { ...to, replace: true }
          : { path: redirectPath };
      next(nextData);
    } else {
      next();
    }
  });
}
