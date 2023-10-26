import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';

const storeServe: AppRouteModule = {
  path: '/store-serve',
  name: 'StoreServe',
  component: LAYOUT,
  meta: {
    orderNo: 600,
    icon: 'gg:loadbar-doc',
    title: '采购管理',
    roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3],
  },
  children: [
    {
      path: 'product-manage',
      name: 'SysAuthProductManage',
      component: () => import('/@/views/auth/super/product.vue'),
      meta: {
        title: '库存查询',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
    {
      path: 'in',
      name: 'StoreIn',
      component: () => import('/@/views/demo/store-serve/in/search.vue'),
      meta: {
        title: '库存入库',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
    {
      path: 'out',
      name: 'StoreOut',
      component: () => import('/@/views/demo/store-serve/out/search.vue'),
      meta: {
        title: '库存出库',
        roles: [RoleEnum.SUPER, RoleEnum.STAFF1,  RoleEnum.STAFF3]
      },
    },
  ],
};

export default storeServe;
