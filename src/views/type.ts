export type DrawerItemType<T> = {
  visible: boolean;
  title: string | undefined;
  item: T;
  productType?: any
  type?: 'scan' | 'add' | 'edit';
};

export type PageListInfo<T> = {
  total: number;
  current: number;
  dataSource: Array<T>;
};
