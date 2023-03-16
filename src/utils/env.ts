// 环境信息
import type { GlobEnvConfig } from "/#/config";
import { getConfigFileName } from "../../build/getConfigFileName";

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return VITE_GLOB_APP_SHORT_NAME;
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // 获取全局配置（打包时将独立提取配置)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_CODE
  } = ENV;

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_APP_CODE
  };
}

/**
 * @description: Development mode
 */
export const devMode = "development";

/**
 * @description: Production mode
 */
export const prodMode = "production";

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
