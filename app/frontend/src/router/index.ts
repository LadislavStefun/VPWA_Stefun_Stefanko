import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/store/authStore';
import type { Pinia } from 'pinia';
import authManager from 'src/services/authManager';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

type RouterFactoryContext = {
  store?: Pinia
}

export default defineRouter(function (context: RouterFactoryContext = {}) {
  const { store } = context
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore(store);
    const token = authManager.getToken()


    if (!authStore.isInitialized && token) {
      try {
        await authStore.fetchUser();
      } catch {
        authManager.logout()
      }
    }

    const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth);
    const guestOnly = to.matched.some((record) => record.meta?.guestOnly);

    if (requiresAuth && !token) {
      if (to.path !== '/auth/login') {
        return { path: '/auth/login', query: { redirect: to.fullPath } };
      }
      return { path: '/auth/login' };
    }

    if (requiresAuth && !authStore.isAuthenticated) {
      return { path: '/auth/login' }
    }
    
    if (guestOnly && authStore.isAuthenticated) {
      return { path: '/main' };
    }


    return true;
  });

  return Router;
});
