import { defHttp } from '/@/utils/http/axios';

enum Api {
  TemplateList = '/contract/template/list', // 全部客户
  TemplateUpload = '/contract/template/upload', // 删除
  TemplateCreate = '/contract/template/create', //详情
  TemplateDelete = '/contract/template/delete',
}

export const getTemplateList = (path?: string) =>
  defHttp.post<any>({
    url: Api.TemplateList,
    params: { path },
  });

export const createTemplate = (params?: any) => defHttp.post<any>({ url: Api.TemplateCreate, params });

export const uploadTemplate = (params?: any) =>
  defHttp.uploadFile<number[]>({ url: Api.TemplateUpload }, params);

  export const deleteTemplate = (params?: any) => defHttp.post<any>({ url: Api.TemplateDelete, params });
