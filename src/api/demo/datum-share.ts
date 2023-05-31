import { defHttp } from '/@/utils/http/axios';

enum Api {
  ShareList = '/sys/share/list', // 全部客户
  ShareUpload = '/sys/share/upload', // 删除
  ShareCreate = '/sys/share/create', //详情
  // ShareDownload = '/sys/share/download', //详情
}

export const getShareList = (path?: string) =>
  defHttp.post<any>({
    url: Api.ShareList,
    params: { path },
  });

export const createShare = (params?: any) => defHttp.post<any>({ url: Api.ShareCreate, params });

export const uploadShare = (params?: any) =>
  defHttp.uploadFile<number[]>({ url: Api.ShareUpload }, params);
