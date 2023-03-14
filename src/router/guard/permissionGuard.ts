import type { Router } from "vue-router";
import { useUserStoreWithOut } from "/@/store/modules/user";
import { PageEnum } from "/@/enums/pageEnum";
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  router.beforeEach((to, from, next) => {
    const token = userStore.getAccessToken;
    const whitePathList: PageEnum[] = [
      PageEnum.RESET_PSW,
      PageEnum.BASE_LOGIN,
      PageEnum.FIND_PSW,
    ];
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }
    next();
    // if (!token) {
    //   const redirectData: {
    //     path: string;
    //     replace: boolean;
    //     query?: Recordable<string>;
    //   } = {
    //     path: "/login",
    //     replace: true,
    //   };

    //   next(redirectData);
    //   return;
    // }
  });
}
