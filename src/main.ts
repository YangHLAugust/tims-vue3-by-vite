import { createApp } from "vue";
import App from "./App.vue";
import { setupStore } from "/@/store/index";
import { router, setupRouter } from "/@/router";
import { setupRouterGuard } from "./router/guard";

import "ant-design-vue/dist/antd.css";
async function bootstrap() {
  const app = createApp(App);

  // Configure store
  // 配置 store
  setupStore(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  app.mount("#app");
}

bootstrap();
