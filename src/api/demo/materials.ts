import { defHttp } from '/@/utils/http/axios';
import { ProductInfo, ProductInInfo, ProductOutInfo } from './model/product';
enum Api {
 
  // 产品入库
  ProductInList = '/product/in/list',
  ProductInPage = '/product/in/page',
  ProductInSave = '/product/in/save',
  ProductInUpdate = '/product/in/update',
  ProductInDelete = '/product/in/delete',

  // 产品出库
  ProductOutList = '/product/out/list',
  ProductOutPage = '/product/out/page',
  ProductOutSave = '/product/out/save',
  ProductOutUpdate = '/product/out/update',
  ProductOutDelete = '/product/in/delete',
}
export interface MaterialsInfo { 
  id: number | undefined
  brand: string | undefined
  name: string | undefined
  number: number | undefined
  unit: string | undefined
}
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

export const removalMaterials = (id: number) =>
  defHttp.post<{ total: number; pageNum: number; data: MaterialsInfo[] }>({
    url: '/materials/basic/delete',
    params: { ids: [id] },
  });

// 入库
export const getProductInPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInInfo[] }>({
    url: Api.ProductInPage,
    params: { pageSize: 10, ...params },
  });
export const saveProductIn = (params?: any) =>
  defHttp.post<any>({ url: Api.ProductInSave, params });
export const updateProductIn = (params?: any) =>
  defHttp.post<any>({ url: Api.ProductInUpdate, params });

export const deleteProductIn = (id: string | number) =>
  defHttp.post<any>({ url: Api.ProductInDelete, params: { id } });

// 出库
export const getProductOutPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductOutInfo[] }>({
    url: Api.ProductOutPage,
    params: { pageSize: 10, ...params },
  });
export const saveProductOut = (params?: any) =>
  defHttp.post<any>({ url: Api.ProductOutSave, params });
export const updateProductOut = (params?: any) =>
  defHttp.post<any>({ url: Api.ProductOutUpdate, params });
export const deleteProductOut = (id: string | number) =>
  defHttp.post<any>({ url: Api.ProductOutDelete, params: { id } });
