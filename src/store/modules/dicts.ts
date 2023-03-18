import type { storageType } from "/@/utils/auth";
import { store } from "/@/store";
import { defineStore } from "pinia";

type dictType = Partial<
  Array<{
    createTime: string | null;
    createUser: string | null;
    createUserName: string | null;
    description: string | null;
    dictCode: string;
    dictId: string;
    id: string;
    isDeleted: number;
    itemKey: string;
    itemValue: string;
    persId: string;
    sortOrder: number;
    status: number;
    updateTime: string | null;
    updateUser: string | null;
    updateUserName: string | null;
  }>
>;

interface dictsState {
  dictsOption: {
    sex: dictType;
    if: dictType;
    code_rule_tims: dictType;
  };
}

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
      return { dictsOption: this.dictsOption } || {};
    },
  },
});
