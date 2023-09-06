import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const contact: AppRouteModule = {
  path: '/contact',
  name: 'Contact',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    orderNo: 300,
    icon: 'game-icons:abstract-004',
    title: '客户合同管理',
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'search',
      name: 'ContactSearch',
      component: () => import('/@/views/demo/customer/contact/search.vue'),
      meta: {
        title: '客户合同管理',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3],
      },
    },
  ],
};
export default contact;
