export type ErrorMessageMode = "none" | "modal" | "message" | undefined;
export type SuccessMessageMode = ErrorMessageMode;

export interface RequestOptions {
  joinParamsToUrl?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  // 是否处理请求结果
  isTransformResponse?: boolean;
  // 是否返回响应header
  isReturnNativeResponse?: boolean;

  joinPrefix?: boolean;
  // 接口地址，如果保留为空，则使用默认apiUrl
  apiUrl?: string;
  // 请求拼接前置路径
  urlPrefix?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 成功消息提示类型
  successMessageMode?: SuccessMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // 是否在header中发送token
  withToken?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
  // 身份验证
  authenticationScheme?: string;
  // 是否关闭请求错误提示
  hideMessage?: false;
}

export interface RetryRequest {
  isOpenRetry: boolean;
  count: number;
  waitTime: number;
}

export interface Result<T = any> {
  code: number;
  success: boolean;
  msg: string;
  data: T;
}

export interface PromiseAllSuccess {
  status: string;
  value: value;
}
