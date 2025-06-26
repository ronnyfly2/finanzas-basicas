<template>
  <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-6 lg:px-8 pt-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">Dashboard de Gastos</h1>
      <p class="text-slate-500">Gestiona las finanzas de tu familia.</p>
    </div>
    <div class="flex items-center flex-wrap gap-2 mt-4 sm:mt-0">
      <DataImportExport />

      <nav class="flex space-x-1 sm:space-x-2 bg-slate-200 p-1 rounded-lg ml-2">
        <router-link
          to="/"
          class="px-3 py-2 text-sm font-semibold rounded-md transition-colors"
          :class="$route.name === 'Dashboard' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-300'"
        >
          Dashboard
        </router-link>
        <router-link
          to="/charts"
          class="px-3 py-2 text-sm font-semibold rounded-md transition-colors"
          :class="$route.name === 'Charts' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-300'"
        >
          Gráficos
        </router-link>
        <router-link
          to="/members"
          class="px-3 py-2 text-sm font-semibold rounded-md transition-colors"
          :class="$route.name === 'Members' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-300'"
        >
          Miembros
        </router-link>
        <router-link
          to="/categories"
          class="px-3 py-2 text-sm font-semibold rounded-md transition-colors"
          :class="$route.name === 'Categories' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-300'"
        >
          Categorías
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import DataImportExport from './DataImportExport.vue';
</script>

<style scoped>
/* Using :class for active links, so router-link-exact-active might not be needed unless preferred */
a.text-slate-600.hover\:bg-slate-300.router-link-exact-active {
    /* This is an example if you wanted to target the non-active-class styled active link */
    /* For this setup, rely on the conditional :class binding and active-class is not used here */
}
</style>
