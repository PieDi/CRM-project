import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const storeServe: AppRouteModule = {
  path: '/store-serve',
  name: 'StoreServe',
  component: LAYOUT,
  meta: {
    orderNo: 300,
    icon: 'gg:loadbar-doc',
    title: '产品管理',
    roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'product-manage',
      name: 'SysAuthProductManage',
      component: () => import('/@/views/auth/super/product.vue'),
      meta: {
        title: '产品信息管理',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
    {
      path: 'in',
      name: 'StoreIn',
      component: () => import('/@/views/demo/store-serve/in/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.in'),
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
    {
      path: 'out',
      name: 'StoreOut',
      component: () => import('/@/views/demo/store-serve/out/search.vue'),
      meta: {
        title: t('routes.demo.store-serve.out'),
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
  ],
};

export default storeServe;
