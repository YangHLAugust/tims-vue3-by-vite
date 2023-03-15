import { useI18n } from "/@/utils/useI18n";
import { ref, computed, unref } from "vue";

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
  const getCodeValueRule = computed(() =>
    createRule(t("sys.login.codeValuePlaceholder"))
  );

  const getFormRules = computed(() => {
    const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    return {
      sysLoginName: accountFormRule,
      password: passwordFormRule,
      codeValue: getCodeValueRule,
    };
  });
  return { getFormRules };
}
