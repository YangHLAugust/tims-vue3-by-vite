import { defHttp } from "/@/utils/axios";
import { ErrorMessageMode } from "/#/axios";
import {
  LoginParams,
  LoginResultModel,
  LoginCodeResultModel,
} from "./model/userModel";
import { getAppEnvConfig } from "/@/utils/env";
const { VITE_GLOB_APP_CODE: appCode } = getAppEnvConfig();
enum Api {
  Login = "/login",
  GetLoginCode = "/getLoginCode",
}

/**
 * @description: user login api
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = "modal"
) {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params: Object.assign({}, params, { appCode }),
    },
    {
      errorMessageMode: mode,
      joinParamsToUrl: true,
    }
  );
}

export function getLoginCodeApi() {
  return defHttp.get<LoginCodeResultModel>({
    url: Api.GetLoginCode,
    params: { appCode },
  });
}
