export interface VisitReturnInfo {
  customerId: number | undefined;
  item: string | undefined;
  nextPlan: string | undefined;
  title: string | undefined;
  visitContent: string | undefined;
  type: number | undefined;
  visitTime: any;
  remark: string | undefined;
}

export interface CalendarObject {
  date: string;
  count: number;
  visits: Array<{
    id: number;
    title: string;
    status: number;
  }>;
}
