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
      meta: {
        title: t('routes.demo.customer.search.init'),
      },
      children: [
        {
          path: 'info',
          name: 'SearchInfo',
          component: () => import('/@/views/demo/customer/search/info.vue'),
          meta: {
            title: t('routes.demo.customer.search.info'),
          },
        },
        {
          path: 'mHistory',
          name: 'SearchMHistory',
          component: () => import('/@/views/demo/customer/search/m-history.vue'),
          meta: {
            title: t('routes.demo.customer.search.mHistory'),
          },
        },
        {
          path: 'order',
          name: 'SearchOrder',
          component: () => import('/@/views/demo/customer/search/order.vue'),
          meta: {
            title: t('routes.demo.customer.search.order'),
          },
        },
        {
          path: 'contact',
          name: 'SearchContact',
          component: () => import('/@/views/demo/customer/search/contact.vue'),
          meta: {
            title: t('routes.demo.customer.search.contact'),
          },
        },
        {
          path: 'invoice',
          name: 'SearchInvoice',
          component: () => import('/@/views/demo/customer/search/invoice.vue'),
          meta: {
            title: t('routes.demo.customer.search.invoice'),
          },
        },
      ],
    },

    {
      path: 'info',
      name: 'Info',
      meta: {
        title: t('routes.demo.customer.info.init'),
      },
      children: [
        {
          path: 'group',
          name: 'InfoGroup',
          component: () => import('/@/views/demo/customer/search/info.vue'),
          meta: {
            title: t('routes.demo.customer.info.group'),
          },
        },
        {
          path: 'info',
          name: 'InfoInfo',
          component: () => import('/@/views/demo/customer/search/info.vue'),
          meta: {
            title: t('routes.demo.customer.info.info'),
          },
        },
      ],
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
