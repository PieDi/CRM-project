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
  /*  */ customerBasic: CustomerInfo /*  */;
  diseases: Array<{
    diseaseBasic: CustomerMHInfo;
    diseaseMedicine: {
      count: number;
      last: CustomerDInfo;
    };
    diseaseCheck: {
      count: number;
      last: CustomerEInfo;
    };
    diseaseImage: {
      count: number;
      last: CustomerIInfo;
    };
    diseaseConsultation: {
      count: number;
      last: CustomerCInfo;
    };
  }>;
  orders: Array<{
    order: CustomerOrderInfo;
    orderContracts: Array<CustomerContractInfo>;
    orderInvoices: Array<CustomerInvoiceInfo>;
  }>;
}

export interface CustomerInfo {
  id: number | undefined;
  age: number | undefined;
  birth: string | undefined;
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
  files: Array<{ id: number,fileName: string; path: string }> | undefined;
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
  visitDate: number | undefined;
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
  files: Array<{
    id: number,
    fileName: string; path: string
  }> | undefined;
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
  files: Array<{ fileName: string; path: string }> | undefined;
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
  files: Array<{ fileName: string; path: string }> | undefined;
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
  files: Array<{ fileName: string; path: string }> | undefined;
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
}

export interface CustomerOrderInfo {
  id?: number | undefined;
  orderAmount: number | undefined;
  orderQuantity: number | undefined;
  orderDate: number | undefined;
  orderName: string | undefined;
  orderNumber: string | undefined;
  productId: number | undefined;
  customerId: number | undefined;
  remark: string | undefined;
  responsiblePerson: string | undefined;
  next: { status: number; operate: string }[] | undefined;
  outStorage: boolean | undefined;
  status: number | undefined;
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
  id: number | undefined;
  orderId: number | undefined;
  name: string | undefined;
  firstParty: string | undefined;
  secondParty: string | undefined;
  effectiveStart: number | undefined;
  effectiveEnd: number | undefined;
  description: string | undefined;
  createUserId: number | undefined;
  createTime: string | undefined;
}
/**
 * 客户发票信息
 */
export interface CustomerInvoiceInfo {
  id: number | undefined;
  orderId: number | undefined;
  name: string | undefined;
  number: string | undefined;
  serial: string | undefined;
  amount: number | undefined;
  agent: string | undefined;
  invoiceTime: number | undefined;
  status: number | undefined;
}
