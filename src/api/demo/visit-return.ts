import { defHttp } from '/@/utils/http/axios';
import { VisitReturnInfo, CalendarObject } from './model/visit-return';

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

export const getVisitCalendar = (params: { month?: string; year?: string }) =>
  defHttp.post<Array<CalendarObject>>({
    url: Api.VisitCalendar,
    params
  });

export const getVisitPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: VisitReturnInfo[] }>({
    url: Api.VisitPage,
    params: { pageSize: 20, ...params },
  });
export const getVisitList = (params: { customerId: number; status: number }) =>
  defHttp.post<Array<VisitReturnInfo>>({
    url: Api.VisitList,
    params,
  });

export const saveVisit = (params?: any) => defHttp.post<any>({ url: Api.SaveVisit, params });

export const updateVisit = (params?: any) => defHttp.post<any>({ url: Api.UpdateVisit, params });

export const deleteVisit = (id: string | number) =>
  defHttp.post<any>({ url: Api.DeleteVisit, params: { id } });

export const getVisit = (id: string | number) =>
  defHttp.post<VisitReturnInfo>({ url: Api.VisitDetail, params: { id } });
