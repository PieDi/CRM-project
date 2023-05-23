import { defHttp } from '/@/utils/http/axios';
import {
  CustomerListParams,
  CustomerInfo,
  CustomerSaveParams,
  CustomerMHListParams,
  CustomerMHInfo,
  CustomerMHSaveParams,
} from './model/customer';

enum Api {
  /**
   * 客户基本信息
   */
  CustomerPage = '/customer/basic/page', // 分页查询列表
  CustomerList = '/customer/basic/list', // 全部客户
  SaveCustomer = '/customer/basic/save', // 保存
  UpdateCustomer = '/customer/basic/update', // 修改
  DeleteCustomer = '/customer/basic/delete', // 删除
  CustomerDetail = '/customer/basic/detail', //详情
  /**
   * 客户病史信息
   */
  CustomerMHPage = '/customer/disease/basic/page', // 病史分页查询列表
  CustomerMHList = '/customer/disease/basic/list', // 全部病史
  SaveCustomerMH = '/customer/disease/basic/save', // 保存病史
  UpdateCustomerMH = '/customer/disease/basic/update', // 修改病史
  DeleteCustomerMH = '/customer/disease/basic/delete', // 删除病史
  CustomerMHDetail = '/customer/disease/basic/detail', // 病史详情
  CustomerMHUpload = '/customer/disease/basic/upload', //详情

  /**
   * 客户用药记录
   */
  CustomerDPage = '/customer/disease/medicine/page', // 用药分页查询列表
  CustomerDList = '/customer/disease/medicine/list', // 全部用药
  SaveCustomerD = '/customer/disease/medicine/save', // 保存用药
  UpdateCustomerD = '/customer/disease/medicine/update', // 修改用药
  DeleteCustomerD = '/customer/disease/medicine/delete', // 删除用药
  CustomerDDetail = '/customer/disease/medicine/detail', // 用药详情
  /**
   * 客户检验记录
   */
  CustomerEPage = '/customer/disease/check/page', // 检验分页查询列表
  CustomerEList = '/customer/disease/check/list', // 全部检验
  SaveCustomerE = '/customer/disease/check/save', // 保存检验
  UpdateCustomerE = '/customer/disease/check/update', // 修改检验
  DeleteCustomerE = '/customer/disease/check/delete', // 删除检验
  CustomerEDetail = '/customer/disease/check/detail', // 检验详情
  /**
   * 客户影像记录
   */
  CustomerIPage = '/customer/disease/image/page', // 影像分页查询列表
  CustomerIList = '/customer/disease/image/list', // 全部影像
  SaveCustomerI = '/customer/disease/image/save', // 保存影像
  UpdateCustomerI = '/customer/disease/image/update', // 修改影像
  DeleteCustomerI = '/customer/disease/image/delete', // 删除影像
  CustomerIDetail = '/customer/disease/image/detail', // 影像详情
  /**
   * 客户就诊记录
   */
  CustomerCPage = '/customer/disease/consultation/page', // 会诊分页查询列表
  CustomerCList = '/customer/disease/consultation/list', // 全部会诊
  SaveCustomerC = '/customer/disease/consultation/save', // 保存会诊
  UpdateCustomerC = '/customer/disease/consultation/update', // 修改会诊
  DeleteCustomerC = '/customer/disease/consultation/delete', // 删除会诊
  CustomerCDetail = '/customer/disease/consultation/detail', // 会诊详情

  /**
   * 客户订单
   */
  CustomerOrderPage = '/customer/order/page', // 订单分页查询列表
  CustomerOrderList = '/customer/order/list', // 全部订单
  SaveCustomerOrder = '/customer/order/save', // 保存订单
  UpdateCustomerOrder = '/customer/order/update', // 修改订单
  DeleteCustomerOrder = '/customer/order/delete', // 删除订单
  CustomerOrderDetail = '/customer/order/detail', // 订单详情
  CustomerOrderHandle = '/customer/order/handle', // 订单详情
}

/**
 * 客户基本信息
 */
export const getCustomerPage = (params: CustomerListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerInfo[] }>({
    url: Api.CustomerPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerList = (name?: string) =>
  defHttp.post<Array<CustomerInfo>>({
    url: Api.CustomerList,
    params: { name },
  });

export const saveCustomer = (params?: CustomerSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomer, params });

export const updateCustomer = (params?: CustomerSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomer, params });

export const deleteCustomer = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomer, params: { id } });

export const getCustomerDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerDetail, params: { id } });

/**
 * 客户病史信息
 */
export const getCustomerMHPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerMHPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerMHList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerMHList,
    params: { name },
  });

export const saveCustomerMH = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerMH, params });

export const updateCustomerMH = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerMH, params });

export const deleteCustomerMH = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerMH, params: { id } });

export const getCustomerMHDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerMHDetail, params: { id } });

export const fileMHUpload = (params: any) =>
  defHttp.uploadFile<{ data: number[] }>({ url: Api.CustomerMHUpload }, params);

/**
 * 客户用药记录
 */
export const getCustomerDPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerDPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerDList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerDList,
    params: { name },
  });

export const saveCustomerD = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerD, params });

export const updateCustomerD = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerD, params });

export const deleteCustomerD = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerD, params: { id } });

export const getCustomerDDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerDDetail, params: { id } });

/**
 * 客户检验记录
 */
export const getCustomerEPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerEPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerEList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerEList,
    params: { name },
  });

export const saveCustomerE = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerE, params });

export const updateCustomerE = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerE, params });

export const deleteCustomerE = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerE, params: { id } });

export const getCustomerEDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerEDetail, params: { id } });

/**
 * 客户影像记录
 */
export const getCustomerIPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerIPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerIList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerIList,
    params: { name },
  });

export const saveCustomerI = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerI, params });

export const updateCustomerI = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerI, params });

export const deleteCustomerI = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerI, params: { id } });

export const getCustomerIDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerIDetail, params: { id } });

/**
 * 客户就诊记录
 */
export const getCustomerCPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerCPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerCList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerCList,
    params: { name },
  });

export const saveCustomerC = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerC, params });

export const updateCustomerC = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerC, params });

export const deleteCustomerC = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerC, params: { id } });

export const getCustomerCDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerCDetail, params: { id } });

/**
 * 客户订单
 */
export const getCustomerOrderPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerOrderPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerOrderList = (name?: string) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerOrderList,
    params: { name },
  });

export const saveCustomerOrder = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerOrder, params });

export const updateCustomerOrder = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerOrder, params });

export const deleteCustomerOrder = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerOrder, params: { id } });

export const getCustomerOrderDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerOrderDetail, params: { id } });

export const handleCustomerOrder = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.CustomerOrderHandle, params });
