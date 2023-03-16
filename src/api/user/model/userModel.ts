/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  account: string;
  password: string;
  appCode: string;
  uuid: string;
  codeValue: string;
}

export interface LoginResultModel {
  permissions: Nullable<string[]>;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  updatePasswordTime?: number | string | null;
  roleId?: string[];
  roleName?: string[];
  roles: string[] | null;
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

export interface LoginCodeResultModel {
  img: string;
  uuid: string;
}
