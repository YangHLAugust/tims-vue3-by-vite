<template>
  <Layout class="layout">
    <LayoutSider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="light"
    >
      <Logo :collapsed="collapsed" />
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
      </LayoutHeader>
      <LayoutContent
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
        >
        <router-view />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Layout } from "ant-design-vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import Logo from "./logo/index.vue";
const LayoutSider = Layout.Sider;
const LayoutHeader = Layout.Header;
const LayoutContent = Layout.Content;
// const MenuItem = Menu.item;

const collapsed = ref(false);
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
}
</style>
