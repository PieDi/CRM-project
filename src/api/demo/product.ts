import { defHttp } from '/@/utils/http/axios';
import { ProductInfo, ProductInInfo, ProductOutInfo } from './model/product';
enum Api {
  ProductList = '/product/basic/list',
  ProductPage = '/product/basic/page',
  ProductSave = '/product/basic/save',
  ProductUpdate = '/product/basic/update',
  ProductRemoval = '/product/basic/removal',

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

export const getProductList = (params?: any) =>
  defHttp.post<ProductInfo[]>({ url: Api.ProductList, params });

export const getProductPage = (params: { name?: string; number?: number; pageNum: number }) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInfo[] }>({
    url: Api.ProductPage,
    params: { pageSize: 10, ...params },
  });
export const saveProduct = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInfo[] }>({
    url: Api.ProductSave,
    params,
  });
export const updateProduct = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInfo[] }>({
    url: Api.ProductUpdate,
    params,
  });

export const removalProduct = (id: number) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInfo[] }>({
    url: Api.ProductRemoval,
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
