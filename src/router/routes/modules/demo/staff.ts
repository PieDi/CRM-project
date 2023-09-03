import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';


const staff: AppRouteModule = {
  path: '/staff',
  name: 'Staff',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 200,
    icon: 'ion:git-compare-outline',
    title: '用户管理',
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
  },
  children: [
 
        {
          path: 'search',
          name: 'StaffSearch',
          component: () => import('/@/views/auth/super/s-manage.vue'),
          meta: {
            title: '用户权限管理',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        }

  ],
};
export default staff;
