<template>
  <Form
    class="login-form"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="handleLogin"
  >
    <div class="tims-logo"></div>
    <FormItem name="sysLoginName" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.sysLoginName"
        :placeholder="t('sys.login.accountPlaceholder')"
        class="fix-auto-fill"
      >
        <template #prefix>
          <UserOutlined class="init-color" />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.passwordPlaceholder')"
      >
        <template #prefix>
          <LockOutlined class="init-color" />
        </template>
      </InputPassword>
    </FormItem>
    <FormItem name="codeValue" class="enter-x">
      <div class="imgCode-container">
        <Input
          size="large"
          v-model:value="formData.codeValue"
          :placeholder="t('sys.login.codeValuePlaceholder')"
          class="fix-auto-fill"
        >
          <template #prefix>
            <MessageOutlined class="init-color" />
          </template>
        </Input>
        <div class="imgCode" @click.prevent="getCode">
          <img :src="codeImage" alt="" />
        </div>
      </div>
    </FormItem>
    <FormItem>
      <!-- No logic, you need to deal with it yourself -->
      <Checkbox v-model:checked="rememberMe" size="small">
        <span :class="rememberMe ? 'active-color' : 'init-color'">{{
          t("sys.login.rememberMe")
        }}</span>
      </Checkbox>
    </FormItem>
    <Button type="primary" shape="round" size="large" block>
      {{ t("sys.login.loginButton") }}
    </Button>
  </Form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Form, Input, Row, Col, Button, Checkbox } from "ant-design-vue";
import {
  UserOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { useI18n } from "/@/utils/useI18n";
import { useFormRules } from "./userLogin";
const FormItem = Form.Item;
const InputPassword = Input.Password;

const { getFormRules } = useFormRules();
const { t } = useI18n();

const codeImage = ref();
const rememberMe = ref(false);
const formData = reactive({
  sysLoginName: "",
  password: "",
  codeValue: null,
  uuid: null,
});
console.log(getFormRules);
function getCode() {}
function handleLogin() {}
</script>

<style lang="less" scoped>
.tims-logo {
  width: 90px;
  height: 90px;
  background: url("/@/assets/images/tims-logo.png") no-repeat;
  background-size: cover;
  margin: 10px auto 30px;
}
.login-form {
  max-width: 100%;
  padding: 20px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
  background: #d2dceb;
  border-radius: 15px;
}
.imgCode-container {
  display: flex;
  align-items: center;
  .imgCode {
    width: 146px;
    height: 40px;
    cursor: pointer;
    margin-left: 80px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.init-color {
  color: #8a8a8a;
}
.active-color {
  color: #4b90ff;
}
/deep/ .ant-input-affix-wrapper {
  border: 0;
  border-bottom: 1px solid #c5c2c5;
  background: #d2dceb !important;
}
/deep/ .ant-input-affix-wrapper:focus {
  box-shadow: 0 0px 0px;
}
/deep/.ant-input {
  background: #d2dceb !important;
}
</style>
