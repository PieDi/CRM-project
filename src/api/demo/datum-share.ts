import { defHttp } from '/@/utils/http/axios';
import { CServeInfo } from './model/customer-serve';

enum Api {
  ShareList = '/sys/share/list', // 全部客户
  ShareUpload = '/sys/share/upload', // 删除
  ShareCreate = '/sys/share/create', //详情
}

export const getShareList = (path?: string) =>
  defHttp.post<any>({
    url: Api.ShareList,
    params: { path },
  });

export const createShare = (params?: any) =>
  defHttp.post<any>({ url: Api.ShareCreate, params });

export const uploadShare = (params?: any) =>
  defHttp.post<any>({ url: Api.ShareUpload, params });

