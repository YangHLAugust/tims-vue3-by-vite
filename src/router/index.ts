import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import { PageEnum } from "/@/enums/pageEnum";

import type { AppRouteRecordRaw, AppRouteModule } from "/@/router/types";

/* Layout */
import Layout from "/@/layout/index.vue";
// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.globEager("./modules/**/*.ts");
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList];

const RootRoute: AppRouteRecordRaw = {
  path: "/",
  name: "Root",
  component: Layout,
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root",
  },
  children: [
    {
      path: "dashboard",
      name: "Dashboard",
      component: () => import("/@/views/dashboard/index.vue"),
      meta: { title: "工作台" },
    },
  ],
};

const LoginRoute: AppRouteRecordRaw = {
  path: "/login",
  name: "Login",
  component: () => import("/@/views/login/Login.vue"),
  meta: {
    title: "登录",
  },
};

export const basicRoutes = [LoginRoute, RootRoute];

// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export function setupRouter(app: App<Element>) {
  app.use(router);
}
