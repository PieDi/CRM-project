import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';


const staff: AppRouteModule = {
  path: '/staff',
  name: 'Staff',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 800,
    icon: 'game-icons:afterburn',
    title: '用户管理',
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'search',
      name: 'StaffSearch',
      component: () => import('/@/views/auth/super/s-manage.vue'),
      meta: {
        title: '用户权限管理',
        roles: [RoleEnum.SUPER],
      },
    }

  ],
};
export default staff;
