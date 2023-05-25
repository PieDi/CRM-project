import { defHttp } from '/@/utils/http/axios';
import { ProductInfo,ProductInInfo } from './model/product';
enum Api {
  ProductList = '/product/basic/list',
  // 产品入库
  ProductInList = '/product/in/list',
  ProductInSave = '/product/in/save',
  ProductInUpdate = '/product/in/update',

}

export const getProductList = (params?: {type?: number, name: string}) =>
  defHttp.post<ProductInfo[]>({ url: Api.ProductList, params });

  // 入库
  export const getProductInPage = (params: any) =>
  defHttp.post<{ total: number; pageNum: number; data: ProductInInfo[] }>({
    url: Api.ProductInList,
    params: { pageSize: 20, ...params },
  });
  export const saveProductIn = (params?: any) =>
    defHttp.post<any>({ url: Api.ProductInSave, params });
    export const updateProductIn = (params?: any) =>
  defHttp.post<any>({ url: Api.ProductInUpdate, params });