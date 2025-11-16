import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
   {
    path: '/',
    redirect: '/auth/login'
  },
  
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },


  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        redirect: 'login'
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { guestOnly: true }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
