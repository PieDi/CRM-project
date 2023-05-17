import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

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
      path: 'cs-link',
      name: 'SysAuthCSLink',
      component: () => import('/@/views/auth/cs-link.vue'),
      meta: {
        title: '客户关联',
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
      },
    },
    {
      path: 'micro-order',
      name: 'SysAuthCSLinkMicroOrder',
      component: () => import('/@/views/auth/micro-order.vue'),
      meta: {
        title: '小程序订单',
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
      },
    },
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
      path: 'ns-order',
      name: 'SysAuthNSOrder',
      component: () => import('/@/views/auth/super/ns-order.vue'),
      meta: {
        title: '非标订单管理',
        roles: [RoleEnum.SUPER],
      },
    },
  ],
};

export default dashboard;
