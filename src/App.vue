<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";
import { ConfigProvider } from "ant-design-vue";
</script>

<template>
  <ConfigProvider>
    <RouterView />
  </ConfigProvider>
  <!-- <a-button type="primary" >Primary Button</a-button> -->
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
</template>

<style>
.cursor-pointer {
  cursor: pointer;
}
.white {
  color: white;
}
</style>
