<template>
  <!--  -->
  <div class="menu-container">
    <Menu
      v-model:selected-keys="state.selectedKeys"
      :open-keys="state.openKeys"
      :mode="'inline'"
      :collapsed="props.collapsed"
      collapsible
      @click="clickMenuItem"
    >
      <MenuItem :menus="menus" />
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { Menu } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import MenuItem from "./menuItem.vue";
import { usePermissionStoreWithOut } from "/@/store/modules/permissions";
import { PageEnum } from "/@/enums/pageEnum";

const props = defineProps({
  collapsed: {
    // 侧边栏菜单是否收起
    type: Boolean,
  },
});
// 当前路由
const currentRoute = useRoute();
const router = useRouter();
const menus = usePermissionStoreWithOut().getPermRouterList;
const state = reactive({
  openKeys: [] as string[],
  selectedKeys: [currentRoute.name] as string[],
});

// 获取当前打开的子菜单
const getOpenKeys = () => {
  const meta = currentRoute.meta;
  return (
    meta?.hideInMenu
      ? state?.openKeys || []
      : currentRoute.meta?.namePath ??
        currentRoute.matched.slice(1).map((n) => n.name)
  ) as string[];
};

// 监听菜单收缩状态
watch(
  () => props.collapsed,
  (newVal) => {
    state.openKeys = newVal ? [] : getOpenKeys();
    state.selectedKeys = [currentRoute.name] as string[];
  }
);
// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.name === PageEnum.BASE_LOGIN || props.collapsed) return;
    state.openKeys = getOpenKeys();
    console.log("state.openKeys", state.openKeys);
    state.selectedKeys = [
      currentRoute.meta?.activeMenu ?? currentRoute.name,
    ] as string[];
  },
  {
    immediate: true,
  }
);
// 点击菜单
const clickMenuItem = ({ key }) => {
  if (key === currentRoute.name) return;
  router.push({ name: key });
};
</script>

<style lang="less" scoped></style>
