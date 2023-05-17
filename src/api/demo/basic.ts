import { defHttp } from '/@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

enum Api {
  REGISTER = '/sys/user/save',
}

// Get personal center-basic settings

export const registerApi = (params) =>
  defHttp.post<GetAccountInfoModel>({ url: Api.REGISTER, params });
