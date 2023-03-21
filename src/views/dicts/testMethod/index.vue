<template>
  <div class="test-method">
    <div>testMethod</div>
    <div>{{ dictOptions }}</div>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from "vue"
import { useDictsStoreWithOut } from "/@/store/modules/dicts";
const dictsStore = useDictsStoreWithOut();
const dictOptions = dictsStore.getDictOptions;
</script>

<style lang="less" scoped></style>
