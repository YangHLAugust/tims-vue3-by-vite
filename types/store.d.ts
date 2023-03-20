import { DICTS_ALL_NAME } from "/@/enums/cacheEnum";

export interface UserInfo {
  account: string;
  applicationId: number;
  contrastDeptNames: string[];
  deptId: string[];
  deptName: string[];
  expiresIn: number;
  id: number;
  jobNum: number;
  jobtitle?: number;
  persId: string;
  persName: string;
}

export type storageType = "local" | "session";

export type dictType = Partial<
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
export type dictsKey = keyof typeof DICTS_ALL_NAME;
export interface dictsState {
  dictsOption: {
    [key: dictsKey]: dictType;
  };
}
