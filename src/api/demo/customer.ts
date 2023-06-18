import { defHttp } from '/@/utils/http/axios';
import {
  CustomerListParams,
  CustomerInfo,
  CustomerSaveParams,
  CustomerMHListParams,
  CustomerMHInfo,
  CustomerMHSaveParams,
  CustomerDInfo,
  CustomerEInfo,
  CustomerIInfo,
  CustomerCInfo,
  CustomerOrderInfo,
  CustomerOrderListParams,
  CustomerGroupInfo,
  CustomerSourceInfo,
  CustomerBoard,
  CustomerInvoiceInfo,
  CustomerContractInfo,
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
  AssignCustomer = '/customer/basic/assign', // 委派
  BoardCustomer = '/customer/basic/board',

  /**
   * 客户分组信息
   */
  CustomerGPage = '/customer/group/page', // 分页查询列表
  CustomerGList = '/customer/group/list', // 全部客户
  SaveCustomerG = '/customer/group/save', // 保存
  UpdateCustomerG = '/customer/group/update', // 修改
  DeleteCustomerG = '/customer/group/delete', // 删除

  /**
   * 客户来源
   */
  CustomerSPage = '/customer/source/page', // 分页查询列表
  CustomerSList = '/customer/source/list', // 全部客户
  SaveCustomerS = '/customer/source/save', // 保存
  UpdateCustomerS = '/customer/source/update', // 修改
  DeleteCustomerS = '/customer/source/delete', // 删除

  /**
   * 客户附件下载
   */
  FileDownload = '/customer/file/download',

  /**
   * 客户病史信息
   */
  CustomerMHPage = '/customer/disease/basic/page', // 病史分页查询列表
  CustomerMHList = '/customer/disease/basic/list', // 全部病史
  SaveCustomerMH = '/customer/disease/basic/save', // 保存病史
  UpdateCustomerMH = '/customer/disease/basic/update', // 修改病史
  DeleteCustomerMH = '/customer/disease/basic/delete', // 删除病史
  CustomerMHDetail = '/customer/disease/basic/detail', // 病史详情
  CustomerMHUpload = '/customer/disease/basic/upload', //上传
  CustomerMHFDelete = '/customer/disease/basic/removeFile', //附件删除

  /**
   * 客户用药记录
   */
  CustomerDPage = '/customer/disease/medicine/page', // 用药分页查询列表
  CustomerDList = '/customer/disease/medicine/list', // 全部用药
  SaveCustomerD = '/customer/disease/medicine/save', // 保存用药
  UpdateCustomerD = '/customer/disease/medicine/update', // 修改用药
  DeleteCustomerD = '/customer/disease/medicine/delete', // 删除用药
  CustomerDDetail = '/customer/disease/medicine/detail', // 用药详情
  CustomerDFUpload = '/customer/disease/medicine/upload', //上传
  CustomerDFDelete = '/customer/disease/medicine/removeFile', //删除

  /**
   * 客户检验记录
   */
  CustomerEPage = '/customer/disease/check/page', // 检验分页查询列表
  CustomerEList = '/customer/disease/check/list', // 全部检验
  SaveCustomerE = '/customer/disease/check/save', // 保存检验
  UpdateCustomerE = '/customer/disease/check/update', // 修改检验
  DeleteCustomerE = '/customer/disease/check/delete', // 删除检验
  CustomerEDetail = '/customer/disease/check/detail', // 检验详情
  CustomerEFUpload = '/customer/disease/check/upload', //上传
  CustomerEFDelete = '/customer/disease/medicine/removeFile', //删除
  /**
   * 客户影像记录
   */
  CustomerIPage = '/customer/disease/image/page', // 影像分页查询列表
  CustomerIList = '/customer/disease/image/list', // 全部影像
  SaveCustomerI = '/customer/disease/image/save', // 保存影像
  UpdateCustomerI = '/customer/disease/image/update', // 修改影像
  DeleteCustomerI = '/customer/disease/image/delete', // 删除影像
  CustomerIDetail = '/customer/disease/image/detail', // 影像详情
  CustomerIFUpload = '/customer/disease/image/upload', //上传
  CustomerIFDelete = '/customer/disease/image/removeFile', //删除
  /**
   * 客户就诊记录
   */
  CustomerCPage = '/customer/disease/consultation/page', // 会诊分页查询列表
  CustomerCList = '/customer/disease/consultation/list', // 全部会诊
  SaveCustomerC = '/customer/disease/consultation/save', // 保存会诊
  UpdateCustomerC = '/customer/disease/consultation/update', // 修改会诊
  DeleteCustomerC = '/customer/disease/consultation/delete', // 删除会诊
  CustomerCDetail = '/customer/disease/consultation/detail', // 会诊详情
  CustomerCFUpload = '/customer/disease/consultation/upload', //上传
  CustomerCFDelete = '/customer/disease/consultation/removeFile', //删除

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
  CustomerOrderColumnar = '/customer/order/columnar', // 订单详情
  /**
   * 客户合同管理
   *
   */
  CustomerContractPage = '/customer/order/contract/page', // 合同分页查询列表
  CustomerContractList = '/customer/order/contract/list', // 全部合同
  SaveCustomerContract = '/customer/order/contract/save', // 保存会诊
  UpdateCustomerContract = '/customer/order/contract/update', // 修改会诊
  DeleteCustomerContract = '/customer/order/contract/delete', // 删除会诊
  CustomerContractFUpload = '/customer/order/contract/upload', //上传
  CustomerContractFDelete = '/customer/order/contract/removeFile', //删除

  /**
   * 客户发票管理
   *
   */
  CustomerInvoicePage = '/customer/order/invoice/page', // 合同分页查询列表
  CustomerInvoiceList = '/customer/order/invoice/list', // 全部合同
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

export const assignCustomer = (params?: any) =>
  defHttp.post<any>({ url: Api.AssignCustomer, params });

export const getCustomerFileDownload = (path: string) =>
  defHttp.get<any>({ url: Api.FileDownload, params: { path } });

export const boardCustomer = (id: string) =>
  defHttp.post<CustomerBoard>({ url: Api.BoardCustomer, params: { id } });

/**
 * 客户分组信息
 */
export const getCustomerGPage = (params: CustomerListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerGroupInfo[] }>({
    url: Api.CustomerGPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerGList = (name?: string) =>
  defHttp.post<Array<CustomerGroupInfo>>({
    url: Api.CustomerGList,
    params: { name },
  });

export const saveCustomerG = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerG, params });

export const updateCustomerG = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerG, params });

export const deleteCustomerG = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerG, params: { id } });

/**
 * 客户来源
 */
export const getCustomerSPage = (params: { name?: string; pageNum: number }) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerSourceInfo[] }>({
    url: Api.CustomerSPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerSList = (name?: string) =>
  defHttp.post<Array<CustomerSourceInfo>>({
    url: Api.CustomerSList,
    params: { name },
  });

export const saveCustomerS = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerS, params });

export const updateCustomerS = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerS, params });

export const deleteCustomerS = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerS, params: { id } });

/**
 * 客户病史信息
 */
export const getCustomerMHPage = (params: CustomerMHListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerMHInfo[] }>({
    url: Api.CustomerMHPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerMHList = (customerId?: number) =>
  defHttp.post<Array<CustomerMHInfo>>({
    url: Api.CustomerMHList,
    params: { customerId },
  });

export const saveCustomerMH = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.SaveCustomerMH, params });

export const updateCustomerMH = (params?: CustomerMHSaveParams) =>
  defHttp.post<any>({ url: Api.UpdateCustomerMH, params });

export const deleteCustomerMH = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerMH, params: { id } });

export const getCustomerMHDetail = (id: number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerMHDetail, params: { id } });

export const fileMHUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerMHUpload }, params);

export const fileMHDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerMHFDelete, params: { fileId } });
/**
 * 客户用药记录
 */
export const getCustomerDList = (diseaseId: number) =>
  defHttp.post<Array<CustomerDInfo>>({
    url: Api.CustomerDList,
    params: { diseaseId },
  });

export const saveCustomerD = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerD, params });

export const updateCustomerD = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerD, params });

export const deleteCustomerD = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerD, params: { id } });
export const fileDUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerDFUpload }, params);
export const fileDDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerDFDelete, params: { fileId } });
/**
 * 客户检验记录
 */
export const getCustomerEList = (diseaseId: number) =>
  defHttp.post<Array<CustomerEInfo>>({
    url: Api.CustomerEList,
    params: { diseaseId },
  });

export const saveCustomerE = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerE, params });

export const updateCustomerE = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerE, params });
export const fileEUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerEFUpload }, params);
export const fileEDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerEFDelete, params: { fileId } });
/**
 * 客户影像记录
 */
export const getCustomerIList = (diseaseId: number) =>
  defHttp.post<Array<CustomerIInfo>>({
    url: Api.CustomerIList,
    params: { diseaseId },
  });

export const saveCustomerI = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerI, params });

export const updateCustomerI = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerI, params });
export const fileIUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerIFUpload }, params);
export const fileIDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerIFDelete, params: { fileId } });
/**
 * 客户就诊记录
 */
export const getCustomerCList = (diseaseId: number) =>
  defHttp.post<Array<CustomerCInfo>>({
    url: Api.CustomerCList,
    params: { diseaseId },
  });

export const saveCustomerC = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerC, params });

export const updateCustomerC = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerC, params });
export const fileCUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerCFUpload }, params);
export const fileCDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerCFDelete, params: { fileId } });
/**
 * 客户订单
 */
export const getCustomerOrderPage = (params: CustomerOrderListParams) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerOrderInfo[] }>({
    url: Api.CustomerOrderPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerOrderList = (name?: string) =>
  defHttp.post<Array<CustomerOrderInfo>>({
    url: Api.CustomerOrderList,
    params: { name },
  });

export const saveCustomerOrder = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerOrder, params });

export const updateCustomerOrder = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerOrder, params });

export const deleteCustomerOrder = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerOrder, params: { id } });

export const getCustomerOrderDetail = (id: string | number) =>
  defHttp.post<CustomerInfo>({ url: Api.CustomerOrderDetail, params: { id } });

export const handleCustomerOrder = (params: { id: number; status: number }) =>
  defHttp.post<any>({ url: Api.CustomerOrderHandle, params });

export const columnarCustomerOrder = (type: number) =>
  defHttp.post<Array<{ date: string; count: number }>>({
    url: Api.CustomerOrderColumnar,
    params: { type },
  });

/**
 * 客户发票
 */
export const getCustomerInvoicePage = (params: { pageNum?: number; name?: string; id?: string }) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerInvoiceInfo[] }>({
    url: Api.CustomerInvoicePage,
    params: { pageSize: 20, ...params },
  });

/*
 * 客户合同信息
 */
export const getCustomerContractPage = (params: { pageNum?: number; name?: string; id?: string }) =>
  defHttp.post<{ total: number; pageNum: number; data: CustomerContractInfo[] }>({
    url: Api.CustomerContractPage,
    params: { pageSize: 20, ...params },
  });
export const getCustomerContractList = (name?: string) =>
  defHttp.post<Array<CustomerContractInfo>>({
    url: Api.CustomerContractList,
    params: { name },
  });
export const saveCustomerContract = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveCustomerContract, params });

export const updateCustomerContract = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateCustomerContract, params });

export const deleteCustomerContract = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteCustomerContract, params: { id } });

export const fileContractUpload = (params: any) =>
  defHttp.uploadFile<number[]>({ url: Api.CustomerContractFUpload }, params);

export const fileContractDelete = (fileId: number) =>
  defHttp.post<number[]>({ url: Api.CustomerContractFDelete, params: { fileId } });
