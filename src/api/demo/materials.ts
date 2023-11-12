import { defHttp } from '/@/utils/http/axios';

export interface MaterialsInfo { 
  types: number[] | undefined
  id: number | undefined
  brand: string | undefined
  name: string | undefined
  specification: string | undefined
  number: number | undefined
  unit: string | undefined
}




export const getMaterialsTypes = () =>
  defHttp.post<any[]>({ url: '/materials/type/all' });

export const getMaterialsList = (params?: any) =>
  defHttp.post<MaterialsInfo[]>({ url: '/materials/basic/list', params });

export const getMaterialsPage = (params: { name?: string; number?: number; pageNum: number }) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/basic/page',
    params: { pageSize: 10, ...params },
  });

export const saveMaterials = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/basic/save',
    params,
  });
export const updateMaterials = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/basic/update',
    params,
  });

export const removeMaterials = (id: number) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/basic/delete',
    params: { id },
  });

// 入库
export const getMaterialsInPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/in/page',
    params: { pageSize: 10, ...params },
  });
export const saveMaterialsIn = (params?: any) =>
  defHttp.post<any>({ url: '/materials/in/save', params });
export const updateMaterialsIn = (params?: any) =>
  defHttp.post<any>({ url: '/materials/in/update', params });

export const deleteMaterialsIn = (id: string | number) =>
  defHttp.post<any>({ url: '/materials/in/delete', params: { id } });

// 出库
export const getMaterialsOutPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/out/page',
    params: { pageSize: 10, ...params },
  });
export const saveMaterialsOut = (params?: any) =>
  defHttp.post<any>({ url: '/materials/out/save', params });
export const updateMaterialsOut = (params?: any) =>
  defHttp.post<any>({ url: '/materials/out/update', params });
export const deleteMaterialsOut = (id: string | number) =>
  defHttp.post<any>({ url: '/materials/out/delete', params: { id } });
