import { defHttp } from '/@/utils/http/axios';
import { CServeInfo } from './model/customer-serve';

enum Api {
  
  VisitCalendar = '/customer/returnVisit/calendar', // 分页查询列表
  VisitPage = '/customer/returnVisit/page', // 分页查询列表
  VisitList = '/customer/returnVisit/list', // 全部客户
  SaveVisit = '/customer/returnVisit/save', // 保存
  UpdateVisit = '/customer/returnVisit/update', // 修改
  DeleteVisit = '/customer/returnVisit/delete', // 删除
  HandleVisit = '/customer/returnVisit/delete', // 删除
  VisitDetail = '/customer/returnVisit/detail', //详情
}

export const getVisitCalendar = () =>
  defHttp.post<Array<CServeInfo>>({
    url: Api.VisitCalendar,
  });

export const getVisitPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: CServeInfo[] }>({
    url: Api.VisitPage,
    params: { pageSize: 20, ...params },
  });
export const getVisitList = (name?: string) =>
  defHttp.post<Array<CServeInfo>>({
    url: Api.VisitList,
    params: { name },
  });

export const saveVisit = (params?: any) =>
  defHttp.post<any>({ url: Api.SaveVisit, params });

export const updateVisit = (params?: any) =>
  defHttp.post<any>({ url: Api.UpdateVisit, params });

export const deleteVisit = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteVisit, params: { id } });

export const getVisit = (id: string | number) =>
  defHttp.post<CServeInfo>({ url: Api.VisitDetail, params: { id } });
