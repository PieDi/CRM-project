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
  Register = '/sys/user/save',
  Login = '/sys/login',
  GetUserInfo = '/sys/user/info',
  GetUserDetail = '/sys/user/detail',
}

/**
 * @description: user login api
 */
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

export const registerApi = (params) => defHttp.post<RegisterParams>({ url: Api.Register, params });

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

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
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
