import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/astrology',
    // component: () => import(/* webpackChunkName: "china" */ '../views/China')
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
        meta: { hiddenCommonTab: true },
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
