import { VisitReturnInfo } from './visit-return';
/**
 * 客户列表请求类型
 */
export interface CustomerListParams {
  documentNumber?: string;
  groupId?: number;
  assign?: number;
  name?: string;
  pageNum: number;
}
/**
 * 客户信息看板
 */
export interface CustomerBoard {
  customerBasic: CustomerInfo;
  diseases: any;
  orders: Array<{
    order: CustomerOrderInfo;
    orderContracts: Array<CustomerContractInfo>;
    orderInvoices: Array<CustomerInvoiceInfo>;
  }>;
  returnVisits: Array<VisitReturnInfo>;
}

export interface CustomerInfo {
  id: number | undefined;
  age: number | undefined;
  type: number | undefined;
  birth: string | undefined;
  surName: string | undefined;
  contactAddress: string | undefined;
  documentNumber: string | undefined;
  documentType: number | undefined;
  groupId: number | undefined;
  level: number | undefined;
  mobile: string | undefined;
  name: string | undefined;
  remark: string | undefined;
  sex: number | undefined;
  sourceId: number | undefined;
  tag: string | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}

export interface CustomerGroupInfo {
  id: number | string | undefined;
  type: number | undefined;
  description: string | undefined;
  name: string | undefined;
}

export interface CustomerSourceInfo {
  id: number | string | undefined;
  description: string | undefined;
  name: string | undefined;
}
export interface CustomerSaveParams extends CustomerInfo {}

/**
 * 客户病史信息
 */
export interface CustomerMHListParams {
  customerName?: string;
  diseaseName?: number;
  hospitalName?: string;
  pageNum: number;
  id?: string;
  customerId?: string;
}

export interface CustomerMHInfo {
  customerId: number | undefined;
  id: number | undefined;
  departmentName: string | undefined;
  diseaseName: string | undefined;
  hospitalName: string | undefined;
  visitDate: number | undefined;
  remark: string | undefined;
}

export interface CustomerMHSaveParams {
  customerId: number | string | undefined;
  id?: number | string | undefined;
  departmentName: string | undefined;
  diseaseName: string | undefined;
  hospitalName: string | undefined;
  visitDate: string | undefined;
  fileIds: number[] | undefined;
}
/**
 * 客户用药
 */
export interface CustomerDInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  medicineName: string | undefined;
  useDose: string | undefined;
  useDate: string | undefined;
  fileIds: number[] | undefined;
  newFiles: any[] | undefined;
  files:
    | Array<{
        id: number;
        fileName: string;
        path: string;
      }>
    | undefined;
}
/**
 * 客户检验
 */
export interface CustomerEInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  checkMechanism: string | undefined;
  checkType: string | undefined;
  checkDate: number | undefined;
  fileIds: number[] | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}
/**
 * 客户影像
 */
export interface CustomerIInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  checkMechanism: string | undefined;
  checkType: number | undefined;
  checkDate: number | undefined;
  checkPart: string | undefined;
  fileIds: number[] | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}
/**
 * 客户会诊
 */
export interface CustomerCInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  consultationContent: string | undefined;
  consultationExpert: string | undefined;
  consultationDate: number | undefined;
  fileIds: number[] | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}

/**
 * 客户订单查询
 */
export interface CustomerOrderListParams {
  customerName?: string;
  orderNumber?: number;
  pageNum: number;
  source?: number;
  productType?: number;
  id: string | undefined;
  customerId?: string;
}

export interface CustomerOrderInfo {
  id?: number | undefined;
  totalPrice: number | undefined;
  orderQuantity: number | undefined;
  orderDate: number | undefined;
  orderTime: string | undefined;
  orderName: string | undefined;
  orderNumber: string | undefined;
  productId: number | undefined;
  customerId: number | undefined;
  remark: string | undefined;
  responsiblePerson: string | undefined;
  next: { status: number; operate: string }[] | undefined;
  outStorage: boolean | undefined;
  status: number | undefined;
  source: number | undefined;
}

/**
 * 客户合同查询
 */
export interface CustomerContractListParams {
  customerName?: string;
  pageNum: number;
  pageSize: number;
  id: string | undefined; // 合同id
  orderId: string | undefined; // 订单id
  name: string | undefined; //合同名称
}

/**
 * 客户合同信息
 */
export interface CustomerContractInfo {
  id?: number | undefined;
  customerId: number | undefined;
  orderId: string | undefined;
  name: string | undefined;
  number: string | undefined;
  orderName: string | undefined;
  price: number | undefined;
  type: number | undefined;
  status: number | undefined;
  signTime: number | undefined;
  effectiveStart: number | undefined;
  effectiveEnd: number | undefined;
  description: string | undefined;
  firstParty?: string | undefined;
  secondParty?: string | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}
/**
 * 客户发票信息
 */
export interface CustomerInvoiceInfo {
  id: number | undefined;
  orderId: number | undefined;
  type: number | undefined;
  orderName: string | undefined;
  customerId: number | undefined;
  name: string | undefined;
  number: string | undefined;
  serial: string | undefined;
  amount: number | undefined;
  agent: string | undefined;
  mobile: string | undefined;
  email: string | undefined;
  bankAccount: string | undefined;
  bank: string | undefined;
  status: number | undefined;
  files: Array<{ id: number; fileName: string; path: string }> | undefined;
}
