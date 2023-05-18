/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userName: string;
  password: string;
}
export interface RegisterParams {
  userName: string;
  password: string;
  email: string;
  mobile?: string;
}
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  userName: string;
  // 邮箱
  email: string;
  // 手机
  mobile: string;
  status: number;
  // 介绍
  roleIdList?: RoleInfo[];
}
