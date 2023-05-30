import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/sys-auth',
  name: 'SysAuth',
  component: LAYOUT,
  meta: {
    orderNo: 600,
    icon: 'ion:grid-outline',
    title: '系统管理',
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'staff-manage',
      name: 'SysAuthStaffManage',
      component: () => import('/@/views/auth/super/s-manage.vue'),
      meta: {
        title: '员工管理',
        roles: [RoleEnum.SUPER],
      },
    },
    {
      path: 'product-manage',
      name: 'SysAuthProductManage',
      component: () => import('/@/views/auth/super/product.vue'),
      meta: {
        title: '产品信息管理',
        roles: [RoleEnum.SUPER],
      },
    },
  ],
};

export default dashboard;
