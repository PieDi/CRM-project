import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const datumShare: AppRouteModule = {
  path: '/datum-share',
  name: 'DatumShare',
  component: LAYOUT,
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  meta: {
    orderNo: 500,
    icon: 'ion:tv-outline',
    title: t('routes.demo.datum-share.init'),
  },
  children: [
    {
      path: '/classify',
      name: 'Classify',
      component: () => import('/@/views/demo/level/Menu111.vue'),
      meta: {
        title: t('routes.demo.datum-share.classify'),
      },
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('/@/views/demo/level/Menu111.vue'),
      meta: {
        title: t('routes.demo.datum-share.upload'),
      },
    },
    {
      path: '/download',
      name: 'Download',
      component: () => import('/@/views/demo/level/Menu111.vue'),
      meta: {
        title: t('routes.demo.datum-share.download'),
      },
    },
  ],
};

export default datumShare;
