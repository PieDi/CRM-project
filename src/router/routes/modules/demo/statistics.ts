import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';

const statisticsManage: AppRouteModule = {
  path: '/statistics',
  name: 'StatisticsManage',
  component: LAYOUT,
  meta: {
    orderNo: 400,
    icon: 'ion:layers-outline',
    title: '统计管理',
    roles: [RoleEnum.SUPER, RoleEnum.STAFF2,  RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'order',
      name: 'StatisticsOrder',
      component: () => import('@/views/demo/statistics/order-statistics.vue'),
      meta: {
        title: '订单统计',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF2,  RoleEnum.STAFF3]
      }
    },
            {
          path: 'micro-order',
          name: 'SysAuthCSLinkMicroOrder',
          component: () => import('/@/views/auth/micro-order.vue'),
          meta: {
            title: '小程序订单统计',
            roles: [RoleEnum.SUPER, RoleEnum.STAFF2,  RoleEnum.STAFF3]
          },
        },

  ],
};

export default statisticsManage;
