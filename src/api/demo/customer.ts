import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';
import { UserInfo } from '/#/store';

enum Api {
  CustomerList = '/sys/user/list',
  AddCustomer = '/sys/user/save',
  DeleteCustomer = '/sys/user/delete',
  CustomerDetail = '/sys/user/detail',
}

export const getCustomerList = (params: { pageNum: number; userName?: string }) =>
  defHttp.post<{ total: number; data: UserInfo[] }>({
    url: Api.CustomerList,
    params: { pageSize: 20, ...params },
  });

export const addCustomer = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.AddCustomer, params });

export const deleteCustomer = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.DeleteCustomer, params });

export const getCustomerDetail = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.CustomerDetail, params });
