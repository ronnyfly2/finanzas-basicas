import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { preload: true },
  },
  {
    path: '/charts',
    name: 'Charts',
    component: () => import('../views/ChartsView.vue'),
    meta: { preload: true },
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('../views/MembersView.vue'),
    meta: { preload: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/CategoriesView.vue'),
    meta: { preload: true },
  },
  {
    path: '/currency-settings',
    name: 'CurrencySettings',
    component: () => import('../views/CurrencySettingsView.vue'),
    meta: { preload: true },
  },
  // Redirect to Dashboard for any unknown paths
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Vite's import.meta.env.BASE_URL for base path
  routes,
});

export default router;
