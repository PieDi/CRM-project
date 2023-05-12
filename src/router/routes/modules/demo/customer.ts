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
      path: 'info',
      name: 'Info',
      meta: {
        title: t('routes.demo.customer.info.init'),
      },
      children: [
        {
          path: 'search',
          name: 'InfoSearch',
          component: () => import('/@/views/demo/customer/info/search.vue'),
          meta: {
            title: t('routes.demo.customer.info.search'),
          },
        },
        // {
        //   path: 'group',
        //   name: 'InfoGroup',
        //   component: () => import('/@/views/demo/customer/search/info.vue'),
        //   meta: {
        //     title: t('routes.demo.customer.info.group'),
        //   },
        // },
        // {
        //   path: 'info',
        //   name: 'InfoInfo',
        //   component: () => import('/@/views/demo/customer/search/info.vue'),
        //   meta: {
        //     title: t('routes.demo.customer.info.info'),
        //   },
        // },
      ],
    },
    {
      path: 'mHistory',
      name: 'MHistory',
      meta: {
        title: t('routes.demo.customer.mHistory.init'),
      },
      children: [
        {
          path: 'search',
          name: 'MHistorySearch',
          component: () => import('/@/views/demo/customer/m-history/search.vue'),
          meta: {
            title: t('routes.demo.customer.mHistory.search'),
          },
        },
      ],
    },
    {
      path: 'order',
      name: 'Order',
      meta: {
        title: t('routes.demo.customer.order.init'),
      },
      children: [
        {
          path: 'search',
          name: 'OrderSearch',
          component: () => import('/@/views/demo/customer/order/search.vue'),
          meta: {
            title: t('routes.demo.customer.order.search'),
          },
        },
      ],
    },
    {
      path: 'contact',
      name: 'Contact',
      meta: {
        title: t('routes.demo.customer.contact.init'),
      },
      children: [
        {
          path: 'search',
          name: 'ContactSearch',
          component: () => import('/@/views/demo/customer/contact/search.vue'),
          meta: {
            title: t('routes.demo.customer.contact.search'),
          },
        },
      ],
    },
    {
      path: 'invoice',
      name: 'Invoice',
      meta: {
        title: t('routes.demo.customer.invoice.init'),
        // hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'search',
          name: 'InvoiceSearch',
          component: () => import('/@/views/demo/customer/invoice/search.vue'),
          meta: {
            title: t('routes.demo.customer.invoice.search'),
          },
        },
      ],
    },
  ],
};

export default customer;
