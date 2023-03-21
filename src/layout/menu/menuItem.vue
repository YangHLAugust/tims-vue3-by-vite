<template>
  <template v-for="item in filterMenus" :key="item.name || item.fullPath">
    <!-- 目录 -->
    <template v-if="isShowSubMenu(item)">
      <SubMenu :key="item?.name" v-bind="$attrs">
        <template #title>
          <MenuItemContent :item="item" />
        </template>
        <template v-if="item.children">
          <!-- 递归生成菜单 -->
          <MyMenuItem :menus="item.children" />
        </template>
      </SubMenu>
    </template>
    <!-- 菜单 -->
    <template v-else>
      <MenuItem :key="item?.name">
        <MenuItemContent :item="item" />
      </MenuItem>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { type PropType, computed } from "vue";
import { Menu } from "ant-design-vue";
import MenuItemContent from "./menuItemContent.vue";
import { AppRouteRecordRaw } from "/@/router/types";

export default defineComponent({
  name: "MyMenuItem",
  components: { MenuItem: Menu.Item, MenuItemContent, SubMenu: Menu.SubMenu },
  props: {
    menus: {
      type: Array as PropType<AppRouteRecordRaw[]>,
      default: () => [],
    },
  },
  setup(props) {
    const filterMenus = computed(() => {
      return [...props.menus]
        .filter((n) => !n.meta?.hideInMenu)
        .sort(
          (a, b) =>
            ((a?.meta?.orderNum as number) || 0) -
            ((b?.meta?.orderNum as number) || 0)
        );
    });

    const isShowSubMenu = (menuItem: AppRouteRecordRaw) => {
      return (
        menuItem?.meta?.type === 0 ||
        (!Object.is(menuItem?.meta?.hideChildrenInMenu, true) &&
          menuItem?.children?.length)
      );
    };
    return {
      filterMenus,
      isShowSubMenu,
    };
  },
});
</script>

<style scoped></style>
