import type { storageType, dictType, dictsState, dictsKey } from "/#/store";
import { store } from "/@/store";
import { defineStore } from "pinia";
import { getDictsCache } from "/@/utils/dicts";
import { DICTS_KEY, DICTS_ALL_NAME } from "/@/enums/cacheEnum";
import { isEmpty } from "/@/utils/is";

export const dictsStore = defineStore({
  id: "app-dicts",
  state: (): dictsState => ({
    dictsOption: {
      sex: [], // 性别
      if: [], // 是否
      code_rule_tims: [], // 申请单编码规则
    },
  }),
  getters: {
    getDictOptions(): dictsState {
      const hasEmpty = Object.values(DICTS_ALL_NAME).some((item) =>
        isEmpty(this.dictsOption[item])
      );
      const res = hasEmpty
        ? { dictsOption: getDictsCache<dictsState>(DICTS_KEY) } || {
            dictsOption: {},
          }
        : { dictsOption: this.dictsOption };
      return res;
    },
  },

  actions: {
    setDictOptions(key: dictsKey, value: dictType) {
      this.dictsOption[key] = value;
    },
  },
});

// 需要在设置外使用
export function useDictsStoreWithOut() {
  return dictsStore(store);
}
