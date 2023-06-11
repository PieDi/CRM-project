import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';

const statisticsManage: AppRouteModule = {
  path: '/statistics',
  name: 'StatisticsManage',
  component: LAYOUT,
  meta: {
    orderNo: 700,
    icon: 'ion:layers-outline',
    title: '统计管理',
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
  },
  children: [
    {
      path: 'order',
      name: 'StatisticsOrder',
      component: () => import('@/views/demo/statistics/order-statistics.vue'),
      meta: {
        title: '订单统计',
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF]
      }
    },

  ],
};

export default statisticsManage;
