import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { RequestOptions, Result } from "/#/axios";

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string; // 身份验证
  transform?: AxiosTransform; // 拦截配置
  requestOptions?: RequestOptions; // 请求配置
}

export abstract class AxiosTransform {
  /**
   * @description: 处理请求数据
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (
    axiosInstance: AxiosResponse,
    error: Error
  ) => void;
}
