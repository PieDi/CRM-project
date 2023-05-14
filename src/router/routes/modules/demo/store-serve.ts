import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const storeServe: AppRouteModule = {
  path: '/store-serve',
  name: 'StoreServe',
  component: LAYOUT,
  meta: {
    orderNo: 400,
    icon: 'gg:loadbar-doc',
    title: t('routes.demo.store-serve.init'),
  },
  children: [
    {
      path: 'in',
      name: 'StoreIn',
      component: () => import('/@/views/demo/store-serve/in/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.in'),
      },
    },
    {
      path: 'out',
      name: 'StoreOut',
      component: () => import('/@/views/demo/store-serve/out/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.out'),
      },
    },
  ],
};

export default storeServe;
