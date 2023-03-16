import { useI18n } from "/@/utils/useI18n";
import { ref, computed, unref, Ref } from "vue";
import type { FormInstance } from "ant-design-vue/lib/form/Form";
import type { NamePath } from "ant-design-vue/lib/form/interface";

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: "change",
    },
  ];
}
const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormRules() {
  const { t } = useI18n();

  const getAccountFormRule = computed(() =>
    createRule(t("sys.login.accountPlaceholder"))
  );
  const getPasswordFormRule = computed(() =>
    createRule(t("sys.login.passwordPlaceholder"))
  );
  const getCodeValueFormRule = computed(() =>
    createRule(t("sys.login.codeValuePlaceholder"))
  );

  const getFormRules = computed(() => {
    const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const codeValueFormRule = unref(getCodeValueFormRule);
    return {
      account: accountFormRule,
      password: passwordFormRule,
      codeValue: codeValueFormRule,
    };
  });
  return { getFormRules };
}

export function useFormValid<T extends Object = any>(
  formRef: Ref<FormInstance>
) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }
  return { validate, validForm };
}
