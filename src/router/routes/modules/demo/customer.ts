import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const customer: AppRouteModule = {
  path: '/customer',
  name: 'Customer',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 100,
    icon: 'ion:git-compare-outline',
    title: t('routes.demo.customer.init'),
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
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
            title: t('routes.demo.customer.info.init'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'group',
          name: 'InfoGroup',
          component: () => import('/@/views/demo/customer/info/group.vue'),
          meta: {
            title: t('routes.demo.customer.info.group'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
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
            title: t('routes.demo.customer.mHistory.init'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
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
            title: t('routes.demo.customer.order.init'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'statistics',
          name: 'OrderStatistics',
          component: () => import('/@/views/demo/customer/order/statistics.vue'),
          meta: {
            title: t('routes.demo.customer.order.statistics'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
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
            title: t('routes.demo.customer.contact.init'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'template',
          name: 'ContactTemplate',
          component: () => import('/@/views/demo/customer/contact/template.vue'),
          meta: {
            title: t('routes.demo.customer.contact.template'),
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
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
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
      ],
    },
  ],
};

export default customer;
