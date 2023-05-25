import { defHttp } from '/@/utils/http/axios';
import { ProductInfo } from './model/product';
enum Api {
  ProductList = '/product/basic/list',
}

export const getProductList = (params?: {type?: number, name: string}) =>
  defHttp.post<ProductInfo[]>({ url: Api.ProductList, params });