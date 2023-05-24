/**
 * 客户基本信息
 */
export interface CustomerListParams {
  documentNumber?: string;
  groupType?: number;
  name?: string;
  pageNum: number;
}

export interface CustomerInfo {
  id: number | string | undefined;
  age: number | undefined;
  birth: string | undefined;
  contactAddress: string | undefined;
  documentNumber: string | undefined;
  documentType: number | undefined;
  groupType: number | undefined;
  level: string | undefined;
  mobile: string | undefined;
  name: string | undefined;
  remark: string | undefined;
  sex: number | undefined;
  source: string | undefined;
  tag: string | undefined;
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
}

export interface CustomerMHInfo {
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

export interface CustomerDInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  medicineName: string | undefined;
  useDose: string | undefined;
  useDate: string | undefined;
  fileIds: number[] | undefined;
}

export interface CustomerEInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  checkMechanism: string | undefined;
  checkType: string | undefined;
  checkDate: number | undefined;
  fileIds: number[] | undefined;
}

export interface CustomerIInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  checkMechanism: string | undefined;
  checkType: number | undefined;
  checkDate: number | undefined;
  checkPart: string | undefined;
  fileIds: number[] | undefined;
}

export interface CustomerCInfo {
  id?: number | undefined;
  diseaseId: number | undefined;
  consultationContent: string | undefined;
  consultationExpert: string | undefined;
  consultationDate: number | undefined;
  fileIds: number[] | undefined;
}
