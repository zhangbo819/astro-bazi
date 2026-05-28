import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/astrology',
    // component: HomeView,
    // component: () => import(/* webpackChunkName: "china" */ '../views/China')
  },
  {
    path: '/world',
    name: 'world',
    component: () => import('@/views/World/indexPage.vue'),
  },
  {
    path: '/china',
    name: 'china',
    component: () => import('@/views/China/indexPage.vue'),
  },
  {
    path: '/province',
    name: 'province',
    component: () => import('@/views/China/provincePage.vue'),
  },
  {
    path: '/astrology',
    name: 'astrology',
    children: [
      {
        path: '',
        component: () => import('@/views/Astrology/indexPage.vue'),
      },
      {
        path: 'interpret',
        component: () => import('@/views/Astrology/InterPret.vue'),
      },
    ],
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/views/Workspace/indexPage.vue'),
    meta: { hiddenCommonTab: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
