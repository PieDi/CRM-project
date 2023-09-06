import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const invoice: AppRouteModule = {
  path: '/invoice',
  name: 'Invoice',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 400,
    icon: 'game-icons:abacus',
    title: '客户发票管理',
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'search',
      name: 'InvoiceSearch',
      component: () => import('/@/views/demo/customer/invoice/search.vue'),
      meta: {
        title: '客户发票管理',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
      },
    }
  ],
};
export default invoice;
