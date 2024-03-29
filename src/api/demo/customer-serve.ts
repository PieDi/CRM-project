import { defHttp } from '/@/utils/http/axios';
import { CServeInfo } from './model/customer-serve';

enum Api {
  CustomerServePage = '/customer/service/page', // 分页查询列表
  CustomerServeList = '/customer/service/list', // 全部客户
  SaveCustomerServe = '/customer/service/save', // 保存
  UpdateCustomerServe = '/customer/service/update', // 修改
  DeleteCustomerServe = '/customer/service/delete', // 删除
  CustomerServeDetail = '/customer/service/detail', //详情
}

/**
 * 客户基本信息
 */
export const getCustomerServePage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: CServeInfo[] }>({
    url: Api.CustomerServePage,
    params: { pageSize: 10, ...params },
  });
export const getCustomerServeList = (name?: string) =>
  defHttp.post<Array<CServeInfo>>({
    url: Api.SaveCustomerServe,
    params: { name },
  });

export const saveCustomerServe = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerServe, params });

export const updateCustomerServe = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerServe, params });

export const deleteCustomerServe = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerServe, params: { id } });

export const getCustomerServeDetail = (id: string | number) =>
  defHttp.post<CServeInfo>({ url: Api.CustomerServeDetail, params: { id } });
