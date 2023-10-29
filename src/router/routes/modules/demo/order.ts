import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const Order: AppRouteModule = {
  path: '/order',
  name: 'Order',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 200,
    icon: 'game-icons:abstract-023',
    title: '小程序订单管理',
    roles: [RoleEnum.SUPER, RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
  },
  children: [
    // {
    //   path: 'search',
    //   name: 'OrderSearch',
    //   component: () => import('/@/views/demo/customer/order/search.vue'),
    //   meta: {
    //     title: '客户订单管理',
    //     roles: [RoleEnum.SUPER, RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
    //   },
    // },
    // {
    //   path: 'ns-order',
    //   name: 'SysAuthNSOrder',
    //   component: () => import('/@/views/auth/super/ns-order.vue'),
    //   meta: {
    //     title: '非标订单管理',
    //     roles: [RoleEnum.SUPER, RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
    //   },
    // },
    {
      path: 'micro-order',
      name: 'SysAuthCSLinkMicroOrder',
      component: () => import('/@/views/auth/micro-order.vue'),
      meta: {
        title: '小程序订单',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
      },
    },
  ],
};
export default Order;
