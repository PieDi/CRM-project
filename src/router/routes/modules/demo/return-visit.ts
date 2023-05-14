import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const returnVisit: AppRouteModule = {
  path: '/return-visit',
  name: 'ReturnVisit',
  component: LAYOUT,
  redirect: '/return-visit/search',
  meta: {
    orderNo: 200,
    icon: 'ion:aperture-outline',
    title: t('routes.demo.return-visit.index'),
  },
  children: [
    {
      path: 'search',
      name: 'ReturnVisitSearch',
      component: () => import('/@/views/demo/visit-return/search.vue'),
      meta: {
        title: t('routes.demo.return-visit.search'),
      },
    },
    // {
    //   path: 'add',
    //   name: 'ReturnVisitAdd',
    //   component: () => import('/@/views/demo/page/form/step/index.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.add'),
    //   },
    // },
    // {
    //   path: 'edit',
    //   name: 'ReturnVisitEdit',
    //   component: () => import('/@/views/demo/page/form/high/index.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.edit'),
    //   },
    // },
    // {
    //   path: 'begin',
    //   name: 'ReturnVisitBegin',
    //   component: () => import('/@/views/demo/page/desc/high/index.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.begin'),
    //   },
    // },
    // {
    //   path: 'cancel',
    //   name: 'ReturnVisitCancel',
    //   component: () => import('/@/views/demo/page/form/high/index.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.cancel'),
    //   },
    // },

    // {
    //   path: 'print',
    //   name: 'DescBasicPage',
    //   component: () => import('/@/views/demo/page/desc/basic/index.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.print'),
    //   },
    // },
  ],
};

export default returnVisit;
