import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const customer: AppRouteModule = {
  path: '/customer',
  name: 'Customer',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 100,
    icon: 'ion:git-compare-outline',
    title: t('routes.demo.customer.init'),
  },
  children: [
    {
      path: 'search',
      name: 'Search',
      component: () => import('/@/views/demo/feat/icon/index.vue'),
      meta: {
        title: t('routes.demo.customer.search'),
      },
    },
    {
      path: 'info',
      name: 'Info',
      component: () => import('/@/views/demo/feat/ws/index.vue'),
      meta: {
        title: t('routes.demo.customer.info'),
      },
    },
    {
      path: 'mHistory',
      name: 'MHistory',
      // @ts-ignore
      component: () => import('/@/views/demo/feat/request-demo/index.vue'),
      meta: {
        title: t('routes.demo.customer.mHistory'),
      },
    },
    {
      path: 'order',
      name: 'Order',
      component: () => import('/@/views/demo/feat/session-timeout/index.vue'),
      meta: {
        title: t('routes.demo.customer.order'),
      },
    },
    {
      path: 'contact',
      name: 'Contact',
      component: () => import('/@/views/demo/feat/print/index.vue'),
      meta: {
        title: t('routes.demo.customer.contact'),
      },
    },
    {
      path: 'invoice',
      name: 'Invoice',
      component: () => import('/@/views/demo/feat/tabs/index.vue'),
      meta: {
        title: t('routes.demo.customer.invoice'),
        hideChildrenInMenu: true,
      },
    },
  ],
};

export default customer;
