import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/charts',
    name: 'Charts',
    component: () => import('../views/ChartsView.vue'),
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('../views/MembersView.vue'),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/CategoriesView.vue'),
  },
  {
    path: '/currency-settings',
    name: 'CurrencySettings',
    component: () => import('../views/CurrencySettingsView.vue'),
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
