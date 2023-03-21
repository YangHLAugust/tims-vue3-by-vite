<template>
  <Layout class="layout">
    <LayoutSider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="light"
    >
      <Logo :collapsed="collapsed" />
      <Menu :collapsed="collapsed" />
    </LayoutSider>
    <Layout>
      <LayoutHeader style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <AppLocalePicker color="black" :reload="false" :showText="false" />
      </LayoutHeader>
      <LayoutContent
        :style="{
          position: 'relative',
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <Loading :loading="loading" :absolute="true" tip="加载中..." />
        <RouterView>
          <template #default="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </template>
        </RouterView>
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Layout } from "ant-design-vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import Logo from "./logo/index.vue";
import Menu from "./menu/index.vue";
import { Loading } from "/@/components/Loading";
import { AppLocalePicker } from "/@/components/AppLocalePicker";
import { useAppStoreWithOut } from "/@/store/modules/app";
const LayoutSider = Layout.Sider;
const LayoutHeader = Layout.Header;
const LayoutContent = Layout.Content;
const collapsed = ref(false);
const appStore = useAppStoreWithOut();
const loading = appStore.getPageLoading;
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    flex: none;
  }
  .trigger {
    padding: 0 15px;
    font-size: 18px;
  }
}
</style>
