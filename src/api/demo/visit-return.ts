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
  VisitStart = '/customer/returnVisit/start', //详情
  ExportVisit = '/customer/returnVisit/export', // 导出
}


export const getTaskCalendar = (params: { month?: string; year?: string }) =>
  defHttp.post<Array<any>>({
    url: '/sys/task/calendar',
    params,
  });
  export const saveTaskCalendar = (params: any) =>
  defHttp.post<Array<any>>({
    url: '/sys/task/save',
    params,
  });
  export const updateTaskCalendar = (params: any) =>
  defHttp.post<Array<any>>({
    url: '/sys/task/update',
    params,
  });
  export const deleteTaskCalendar = (ids: any) =>
  defHttp.post<Array<any>>({
    url: '/sys/task/delete',
    params: {ids},
  });


export const getVisitCalendar = (params: { month?: string; year?: string }) =>
  defHttp.post<Array<CalendarObject>>({
    url: Api.VisitCalendar,
    params,
  });

export const getVisitPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: VisitReturnInfo[] }>({
    url: Api.VisitPage,
    params: { pageSize: 10, ...params },
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
  defHttp.post<any>({ url: Api.VisitDetail, params: { id } });

export const startVisit = (params: any) =>
  defHttp.post<VisitReturnInfo>({ url: Api.VisitStart, params });

  export const exportVisit = () =>
  defHttp.get<any>({ url: Api.ExportVisit});