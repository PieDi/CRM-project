export interface ProductInfo {
  id: number  | undefined;
  name: string | undefined;
  number: string  | undefined;
  type: number  | undefined;
  introduction: string | undefined;
  unit: string | undefined;
  originalPrice: number | undefined;
  price: number | undefined;
  freight: number | undefined;
  amount: number | undefined;
  // integralConversionRatio: number | undefined;
  // integralMaxAvailable: number | undefined;
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