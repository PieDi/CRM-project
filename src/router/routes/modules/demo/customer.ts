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
    // {
    //   path: 'mHistory/search',
    //   name: 'MHistorySearch',
    //   component: () => import('/@/views/demo/customer/m-history/search.vue'),
    //   meta: {
    //     title: '客户就诊信息管理',
    //     roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
    //   },
    // },
    {
      path: 'info/cs-link',
      name: 'SysAuthCSLink',
      component: () => import('/@/views/auth/cs-link.vue'),
      meta: {
        title: '小程序客服委派',
        roles: [RoleEnum.SUPER],
      },
    }
  ],
};
export default customer;
