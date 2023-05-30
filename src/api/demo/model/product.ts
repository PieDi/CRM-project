export interface ProductInfo {
  id: number  | undefined;
  name: string | undefined;
  number: string  | undefined;
  type: number  | undefined;
  introduction: string  | undefined;
}

export interface ProductInInfo { 
  id: number  | undefined;
  amount: number | undefined
  batch: string | undefined
  productId: number | undefined
  unit: string | undefined
  remark: string | undefined
}

export interface ProductOutInfo { 
  id: number  | undefined;
  amount: number | undefined
  batch: string | undefined
  customerId: string | undefined
  orderId: string | undefined
  productId: number | undefined
  unit: string | undefined
  remark: string | undefined
  customerName: string | undefined
}