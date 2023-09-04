import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const customer: AppRouteModule = {
  path: '/customer',
  name: 'Customer',
  component: LAYOUT,
  meta: {
    orderNo: 100,
    icon: 'ion:git-compare-outline',
    title: '客户信息管理',
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'info/search',
      name: 'CustomerSearch',
      component: () => import('/@/views/demo/customer/info/search.vue'),
      meta: {
        title: '信息查询编辑新增',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
      },
    },
    {
      path: 'mHistory/search',
      name: 'MHistorySearch',
      component: () => import('/@/views/demo/customer/m-history/search.vue'),
      meta: {
        title: '客户就诊信息管理',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
      },
    },
    {
      path: 'info/cs-link',
      name: 'SysAuthCSLink',
      component: () => import('/@/views/auth/cs-link.vue'),
      meta: {
        title: '小程序客服委派',
        roles: [RoleEnum.SUPER],
      },
    },
    
  
    



    // {
    //   path: 'info',
    //   name: 'Info',
    //   meta: {
    //     title: t('routes.demo.customer.info.init'),
    //   },
    //   children: [
    //     {
    //       path: 'search',
    //       name: 'InfoSearch',
    //       component: () => import('/@/views/demo/customer/info/search.vue'),
    //       meta: {
    //         title: '客户信息查询管理与新增',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //     {
    //       path: 'group',
    //       name: 'InfoGroup',
    //       component: () => import('/@/views/demo/customer/info/group.vue'),
    //       meta: {
    //         title: '编辑分组标签',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //     {
    //       path: 'source',
    //       name: 'InfoSource',
    //       component: () => import('/@/views/demo/customer/info/source.vue'),
    //       meta: {
    //         title: '编辑客户来源分组',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //     {
    //       path: 'level',
    //       name: 'InfoLevel',
    //       component: () => import('/@/views/demo/customer/info/level.vue'),
    //       meta: {
    //         title: '编辑客户等级',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
        
    //   ],
    // },
    // {
    //   path: 'mHistory',
    //   name: 'MHistory',
    //   meta: {
    //     title: '客户就诊信息管理',
    //   },
    //   children: [
    //     {
    //       path: 'search',
    //       name: 'MHistorySearch',
    //       component: () => import('/@/views/demo/customer/m-history/search.vue'),
    //       meta: {
    //         title: '客户就诊信息录入',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //   ],
    // },
    // {
    //   path: 'order',
    //   name: 'Order',
    //   meta: {
    //     title: t('routes.demo.customer.order.init'),
    //   },
    //   children: [
    //     {
    //       path: 'search',
    //       name: 'OrderSearch',
    //       component: () => import('/@/views/demo/customer/order/search.vue'),
    //       meta: {
    //         title: t('routes.demo.customer.order.init'),
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //     {
    //       path: 'micro-order',
    //       name: 'SysAuthCSLinkMicroOrder',
    //       component: () => import('/@/views/auth/micro-order.vue'),
    //       meta: {
    //         title: '小程序订单',
    //         roles: [RoleEnum.SUPER],
    //       },
    //     },
    //     {
    //       path: 'ns-order',
    //       name: 'SysAuthNSOrder',
    //       component: () => import('/@/views/auth/super/ns-order.vue'),
    //       meta: {
    //         title: '非标订单管理',
    //         roles: [RoleEnum.SUPER],
    //       },
    //     },
    //   ],
    // },
    // {
    //   path: 'contact',
    //   name: 'Contact',
    //   meta: {
    //     title: t('routes.demo.customer.contact.init'),
    //   },
    //   children: [
    //     {
    //       path: 'search',
    //       name: 'ContactSearch',
    //       component: () => import('/@/views/demo/customer/contact/search.vue'),
    //       meta: {
    //         title: '客户合同查询与新增',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //     // {
    //     //   path: 'template',
    //     //   name: 'ContactTemplate',
    //     //   component: () => import('/@/views/demo/customer/contact/template.vue'),
    //     //   meta: {
    //     //     title: t('routes.demo.customer.contact.template'),
    //     //     roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //     //   },
    //     // },
    //     // {
    //     //   path: 't-group',
    //     //   name: 'ContactTGroup',
    //     //   component: () => import('/@/views/demo/customer/contact/t-group.vue'),
    //     //   meta: {
    //     //     title: '合同模板',
    //     //     hideMenu: true,
    //     //     roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //     //   },
    //     // },
    //   ],
    // },
    // {
    //   path: 'invoice',
    //   name: 'Invoice',
    //   meta: {
    //     title: t('routes.demo.customer.invoice.init'),
    //     // hideChildrenInMenu: true,
    //   },
    //   children: [
    //     {
    //       path: 'search',
    //       name: 'InvoiceSearch',
    //       component: () => import('/@/views/demo/customer/invoice/search.vue'),
    //       meta: {
    //         title: '客户发票查询与新增',
    //         roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
    //       },
    //     },
    //   ],
    // },
  ],
};
export default customer;
