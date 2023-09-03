import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const routeModuleList: AppRouteModule[] = [];
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  //@ts-ignore
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
  },
};

export const customerBoard: AppRouteModule = {
  path: '/customer-board',
  name: 'CustomerA',
  meta: {
    title:t('routes.demo.customer.info.dataCenter'),
    // hideMenu: true,
    roles: [RoleEnum.SUPER,  RoleEnum.STAFF],
  },
  component: () => import('/@/views/demo/customer/info/dataCenter.vue'),
};
// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  customerBoard,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
