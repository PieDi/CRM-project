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
    orderNo: 500,
    icon: 'ion:aperture-outline',
    title: t('routes.demo.return-visit.index'),
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
  },
  children: [
    {
      path: 'plan',
      name: 'ReturnListPlan',
      component: () => import('@/views/demo/visit-return/plan.vue'),
      meta: {
        title: '回访工作计划',
        roles: [RoleEnum.SUPER,  RoleEnum.STAFF, RoleEnum.STAFF1, RoleEnum.STAFF2, RoleEnum.STAFF3]
      }
    }
  ],
};

export default returnVisit;
