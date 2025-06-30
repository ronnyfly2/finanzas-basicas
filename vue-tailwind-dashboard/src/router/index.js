import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import ChartsView from '../views/ChartsView.vue';
import MembersView from '../views/MembersView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CurrencySettingsView from '../views/CurrencySettingsView.vue'; // Importar la nueva vista

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/charts',
    name: 'Charts',
    component: ChartsView,
  },
  {
    path: '/members',
    name: 'Members',
    component: MembersView,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesView,
  },
  {
    path: '/currency-settings',
    name: 'CurrencySettings',
    component: CurrencySettingsView,
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
