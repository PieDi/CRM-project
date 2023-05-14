import type { AppRouteModule } from '/@/router/types';

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
  },
  children: [
    {
      path: '/search',
      name: 'Search',
      component: () => import('/@/views/demo/customer-serve/search.vue'),
      meta: {
        title: t('routes.demo.customer-server.search'),
      },
    },
  ],
};

export default customerServe;
