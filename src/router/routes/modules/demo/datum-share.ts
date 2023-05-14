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
      path: 'index',
      name: 'DatumShareClassify',
      component: () => import('/@/views/demo/datum-share/index.vue'),
      meta: {
        title: t('routes.demo.datum-share.classify'),
      },
    },
    {
      path: 'file-group',
      name: 'DatumShareFileGroup',
      component: () => import('/@/views/demo/datum-share/file-group.vue'),
      meta: {
        title: '共享资料',
        hideMenu: true,
      },
    },
  ],
};

export default datumShare;
