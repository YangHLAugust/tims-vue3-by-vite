<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <router-link
      v-if="collapse"
      key="collapse"
      class="sidebar-logo-link"
      to="/"
    >
      <img v-if="logo" :src="logo" class="sidebar-logo" />
      <h1 v-else class="sidebar-title">{{ title }}</h1>
    </router-link>
    <router-link v-else key="expand" class="sidebar-logo-link" to="/">
      <img v-if="logo" :src="logo" class="sidebar-logo" />
      <h1 class="sidebar-title">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { getImageUrl } from "/@/utils/index";

defineProps({
  collapse: { type: Boolean, default: false },
});

const logo = getImageUrl("tims-logo-sm.png");
const title = "检验项目管理系统";
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 4px 4px -3px rgba(0, 21, 41, 0.08);
  margin-bottom: 4px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #707070;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
