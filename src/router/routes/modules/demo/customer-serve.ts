import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const customerServe: AppRouteModule = {
  path: '/customer-serve',
  name: 'CustomerServe',
  component: LAYOUT,
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  meta: {
    orderNo: 300,
    icon: 'ion:menu-outline',
    title: t('routes.demo.customer-server.init'),
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
  },
  children: [
    {
      path: 'search',
      name: 'Search',
      component: () => import('/@/views/demo/customer-serve/search.vue'),
      meta: {
        title: t('routes.demo.customer-server.search'),
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
      },
    },
  ],
};

export default customerServe;
