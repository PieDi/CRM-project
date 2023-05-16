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
    orderNo: 500,
    icon: 'ion:tv-outline',
    title: t('routes.demo.datum-share.init'),
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
  },
  children: [
    {
      path: 'index',
      name: 'DatumShareClassify',
      component: () => import('/@/views/demo/datum-share/index.vue'),
      meta: {
        title: t('routes.demo.datum-share.classify'),
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
      },
    },
    {
      path: 'file-group',
      name: 'DatumShareFileGroup',
      component: () => import('/@/views/demo/datum-share/file-group.vue'),
      meta: {
        title: '共享资料',
        hideMenu: true,
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
      },
    },
  ],
};

export default datumShare;
