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
            title: '客户信息管理与新增',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'group',
          name: 'InfoGroup',
          component: () => import('/@/views/demo/customer/info/group.vue'),
          meta: {
            title: '新增客户分组标签',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'source',
          name: 'InfoSource',
          component: () => import('/@/views/demo/customer/info/source.vue'),
          meta: {
            title: '客户来源分组标签',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
        {
          path: 'cs-link',
          name: 'SysAuthCSLink',
          component: () => import('/@/views/auth/cs-link.vue'),
          meta: {
            title: '小程序客户委派',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
          },
        },
      ],
    },
    {
      path: 'mHistory',
      name: 'MHistory',
      meta: {
        title: '客户就诊信息管理',
      },
      children: [
        {
          path: 'search',
          name: 'MHistorySearch',
          component: () => import('/@/views/demo/customer/m-history/search.vue'),
          meta: {
            title: '客户就诊信息录入',
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
          path: 'micro-order',
          name: 'SysAuthCSLinkMicroOrder',
          component: () => import('/@/views/auth/micro-order.vue'),
          meta: {
            title: '小程序订单',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
          },
        },
        {
          path: 'ns-order',
          name: 'SysAuthNSOrder',
          component: () => import('/@/views/auth/super/ns-order.vue'),
          meta: {
            title: '非标订单管理',
            roles: [RoleEnum.SUPER],
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
        {
          path: 't-group',
          name: 'ContactTGroup',
          component: () => import('/@/views/demo/customer/contact/t-group.vue'),
          meta: {
            title: '合同模板',
            hideMenu: true,
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
            title: '客户发票管理',
            roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
          },
        },
      ],
    },
  ],
};
export default {
  ...customer,
};
