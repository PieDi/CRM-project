import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const returnVisit: AppRouteModule = {
  path: '/return-visit',
  name: 'ReturnVisit',
  component: LAYOUT,
  redirect: '/return-visit/search',
  meta: {
    orderNo: 200,
    icon: 'ion:aperture-outline',
    title: t('routes.demo.return-visit.index'),
    roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
  },
  children: [
    {
      path: 'plan',
      name: 'ReturnListPlan',
      component: () => import('@/views/demo/visit-return/plan.vue'),
      meta: {
        title: '回访工作计划',
        roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF]
      }
    },
    // {
    //   path: 'search',
    //   name: 'ReturnVisitSearch',
    //   component: () => import('/@/views/demo/visit-return/search.vue'),
    //   meta: {
    //     title: t('routes.demo.return-visit.search'),
    //     roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.STAFF],
    //   },
    // }
  ],
};

export default returnVisit;
