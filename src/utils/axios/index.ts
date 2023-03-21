import type { AxiosResponse } from "axios";
import type { AxiosTransform, CreateAxiosOptions } from "./axiosTransform";
import type { RequestOptions, Result } from "/#/axios";
import { VAxios } from "./Axios";
import { useGlobSetting } from "/@/hooks/setting";
import {
  getToken,
  getRefreshToken,
  removeAccessCookie,
  removeRefreshCookie,
} from "/@/utils/auth";
import { isString, isUnDef, isNull, isEmpty } from "/@/utils/is";
import { joinTimestamp, formatRequestDate } from "./helper";
import { RequestEnum, ResultEnum, ContentTypeEnum } from "/@/enums/httpEnum";
import { setObjToUrlParams, deepMerge } from "/@/utils";
import { useI18n } from "/@/utils/useI18n";
import { useMessage } from "/@/hooks/web/useMessage";
import { useUserStoreWithOut } from "/@/store/modules/user";
import { useAppStoreWithOut } from "/@/store/modules/app";
const { createMessage, createErrorModal, createSuccessModal } = useMessage();
import { clone } from "lodash-es";

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const appStore = useAppStoreWithOut();

const transform: AxiosTransform = {
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        );
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, "data") &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },
  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers.common.Authorization =
        options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token;
      (config as Recordable).headers.common["Refresh-Token"] =
        getRefreshToken();
    }
    if (!(config as Recordable)?.requestOptions?.hideLoading)
      appStore.setPageLoadingAction(true);
    return config;
  },
  // 请求错误处理
  requestInterceptorsCatch: (err: Error) => {
    // 关闭loading
    appStore.setPageLoadingAction(false);
    console.log(err);
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    // 结束loading
    appStore.setPageLoadingAction(false);
    return res;
  },

  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse, hideMessage } =
      options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const data = res?.data;
    if (!data) {
      appStore.setPageLoadingAction(false);
      throw new Error(t("sys.api.apiRequestFailed"));
    }

    const { code, msg, data: result } = data;

    const hasSuccess =
      data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS;

    if (hasSuccess) {
      let successMsg = msg;

      if (isNull(successMsg) || isUnDef(successMsg) || isEmpty(successMsg)) {
        successMsg = t(`sys.api.operationSuccess`);
      }

      if (options.successMessageMode === "modal") {
        createSuccessModal({
          title: t("sys.api.successTip"),
          content: successMsg,
        });
      } else if (options.successMessageMode === "message") {
        createMessage.success(successMsg);
      }
      return result;
    }

    let errMsg = "";
    switch (code) {
      case ResultEnum.TIMEOUT:
        errMsg = t("sys.api.timeoutMessage");
        const userStore = useUserStoreWithOut();
        removeAccessCookie();
        removeRefreshCookie();
        userStore.logout(true);
        break;
      case ResultEnum.LOCKED:
        errMsg = t("sys.api.lockedMessage");
      default:
        if (msg) {
          errMsg = msg;
        }
    }

    if (!hideMessage) {
      console.log("options.errorMessageMode", options.errorMessageMode);

      if (options.errorMessageMode === "modal") {
        // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
        createErrorModal({ title: t("sys.api.errorTip"), content: errMsg });
      } else if (options.errorMessageMode === "message") {
        createMessage.error(errMsg, 5);
      }
    }
    appStore.setPageLoadingAction(false);
    throw new Error(errMsg || t("sys.api.apiRequestFailed"));
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    // 后面再写
    appStore.setPageLoadingAction(false);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        authenticationScheme: "Bearer",
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: false,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
          hideMessage: false,
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();
