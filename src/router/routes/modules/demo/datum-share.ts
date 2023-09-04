import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const datumShare: AppRouteModule = {
  path: '/datum-share',
  name: 'DatumShare',
  component: LAYOUT,
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  meta: {
    orderNo: 600,
    icon: 'ion:tv-outline',
    title: t('routes.demo.datum-share.init'),
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
  },
  children: [
    {
      path: 'index',
      name: 'DatumShareClassify',
      component: () => import('/@/views/demo/datum-share/index.vue'),
      meta: {
        title: '共享资料新增',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
      },
    },
    {
      path: 'file-group',
      name: 'DatumShareFileGroup',
      component: () => import('/@/views/demo/datum-share/file-group.vue'),
      meta: {
        title: '共享资料',
        hideMenu: true,
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
      },
    },
  ],
};

export default datumShare;
