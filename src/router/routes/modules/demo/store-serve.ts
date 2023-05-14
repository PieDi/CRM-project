import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const storeServe: AppRouteModule = {
  path: '/store-serve',
  name: 'StoreServe',
  component: LAYOUT,
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  meta: {
    orderNo: 400,
    icon: 'gg:loadbar-doc',
    title: t('routes.demo.store-serve.init'),
  },
  children: [
    {
      path: '/in',
      name: 'In',
      component: () => import('/@/views/demo/store-serve/in/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.in'),
      },
    },
    {
      path: '/out',
      name: 'Out',
      component: () => import('/@/views/demo/store-serve/in/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.out'),
      },
    },
  ],
};

export default storeServe;
