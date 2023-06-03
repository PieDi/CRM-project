export interface VisitReturnInfo {
  id: number | undefined;
  customerId: number | undefined;
  item: string | undefined;
  nextPlan: string | undefined;
  title: string | undefined;
  visitContent: string | undefined;
  type: number | undefined;
  visitTime: any;
  remark: string | undefined;
  way: number | undefined;
  result: number | undefined;
  supplement: string | undefined;
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
