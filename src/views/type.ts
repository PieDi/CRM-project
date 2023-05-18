export type DrawerItemType<T> = {
  visible: boolean;
  title: string;
  item?: T;
  type?: 'scan' | 'add' | 'edit';
};

export type PageListInfo<T> = {
  total: number;
  current: number;
  dataSource: Array<T>;
};
