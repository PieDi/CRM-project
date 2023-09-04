import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const system: AppRouteModule = {
  path: '/customer',
  name: 'System',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 1000,
    icon: 'ion:power-outline',
    title: '系统管理',
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'info/group',
      name: 'InfoGroup',
      component: () => import('/@/views/demo/customer/info/group.vue'),
      meta: {
        title: '编辑分组标签',
        roles: [RoleEnum.SUPER],
      },
    },
    {
      path: 'info/source',
      name: 'InfoSource',
      component: () => import('/@/views/demo/customer/info/source.vue'),
      meta: {
        title: '编辑客户来源分组',
        roles: [RoleEnum.SUPER],
      },
    },
    {
      path: 'info/level',
      name: 'InfoLevel',
      component: () => import('/@/views/demo/customer/info/level.vue'),
      meta: {
        title: '编辑客户等级',
        roles: [RoleEnum.SUPER],
      },
    },
  ],
};
export default system;
