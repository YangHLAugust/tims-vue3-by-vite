import { defHttp } from "/@/utils/axios";
import { ErrorMessageMode } from "/#/axios";
import { dictsKey, dictType } from "/#/store";

enum Api {
  getDictItem = "/biz-tims-center/common/getDictItemList",
}

export function getDictItemApi(
  code: dictsKey,
  mode: ErrorMessageMode = "none"
) {
  return defHttp.get<dictType>(
    {
      url: Api.getDictItem,
      params: { code },
    },
    {
      errorMessageMode: mode,
      joinParamsToUrl: true,
    }
  );
}
