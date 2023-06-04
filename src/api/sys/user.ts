import { defHttp } from '/@/utils/http/axios';
import { LoginParams, RegisterParams, LoginResultModel, GetUserInfoModel } from './model/userModel';
import { UserInfo } from '/#/store';
import { ErrorMessageMode } from '/#/axios';
import CryptoJS from 'crypto-js';

export const SHA256Encrypted = (m: string) => {
  return CryptoJS.SHA256(m).toString();
};
enum Api {
  // Login = '/login',
  // Logout = '/logout',
  // GetUserInfo = '/getUserInfo',
  // GetPermCode = '/getPermCode',
  // TestRetry = '/testRetry',

  Register = '/sys/user/save', //注册
  Login = '/sys/login', //登录
  Logout = '/sys/logout',
  ModifyPwd = '/sys/user/modifyPwd',
  GetUserInfo = '/sys/user/info', // 获取登录用户信息
  GetUserDetail = '/sys/user/detail', // 获取用户信息详情
  // 以及即为员工接口
  UserList = '/sys/user/list', // 获取系统用户列表
  UserPage = '/sys/user/page', // 获取系统用户列表
  DeleteUser = '/sys/user/delete', // 删除用户
  AuthUser = '/sys/user/auth', // 激活用户
  PromotionUser = '/sys/user/promotion', // 角色晋升
  DemotionUser = '/sys/user/demotion',
}

/**
 * @description: user login api
 */
export const registerApi = (params) => defHttp.post<RegisterParams>({ url: Api.Register, params });

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
// 退出登录
export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export const modifyPwdApi = (params) => defHttp.post<{password: string, newPassword: string}>({ url: Api.ModifyPwd, params });

/**
 * @description: getUserInfo
 */
export function getUserInfo(params?: any) {
  return defHttp.post<UserInfo>({ url: Api.GetUserInfo, params }, { errorMessageMode: 'none' });
}
export function getUserDetail(params) {
  return defHttp.post<GetUserInfoModel>(
    { url: Api.GetUserDetail, params },
    { errorMessageMode: 'none' },
  );
}

export const getUserPage = (params: { pageNum: number; userName?: string }) =>
  defHttp.post<{ total: number; pageNum: number; data: UserInfo[] }>({
    url: Api.UserPage,
    params: { pageSize: 20, ...params },
  });
export const getUserList = () =>
  defHttp.post<Array<UserInfo>>({
    url: Api.UserList,
  });

export const deleteUser = (userId: string | number) =>
  defHttp.post<any>({ url: Api.DeleteUser, params: { userId } });

export const authUser = (params: any) => defHttp.post<any>({ url: Api.AuthUser, params });

export const promotionUser = (userId: number) =>
  defHttp.post<any>({ url: Api.PromotionUser, params: { userId } });

export const demotionUser = (userId: number) =>
  defHttp.post<any>({ url: Api.DemotionUser, params: { userId } });

// 项目无用代码
export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
