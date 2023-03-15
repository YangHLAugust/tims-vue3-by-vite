<template>
  <div class="login-container">
    <div class="locale-change">
      <AppLocalePicker :reload="false" :showText="false" />
    </div>
    <div class="login-wrap">
      <div class="title-yk"></div>
      <LoginForm />
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginForm from "./LoginForm.vue";
import { AppLocalePicker } from "/@/components/AppLocalePicker";
</script>
<style scoped lang="less">
/* scoped 使用得定义的样式只在本页面内生效  */
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
@bg: #d2dceb;
@light_gray: #b4b6b7;
@cursor: #8a8a8a;

@supports (-webkit-mask: none) and (not (cater-color: @cursor)) {
  .login-container .el-input input {
    color: @cursor;
  }
}

.login-container {
  height: 100vh;
  width: 100%;
  background-image: url("/@/assets/images/login-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;

  .login-wrap {
    position: relative;
    width: 550px;
    margin: 0 auto;
    top: 10vh;
  }

  .title-yk {
    width: 288px;
    height: 88px;
    background: url("/@/assets/images/system-title.png") no-repeat;
    background-size: cover;
    margin: 0 auto;
  }
  .locale-change {
    position: fixed;
    top: 5vh;
    left: 5vh;
  }
}
</style>
