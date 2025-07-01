<template>
  <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-6 lg:px-8 pt-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-800">Dashboard de Gastos</h1>
      <p class="text-slate-500">Gestiona las finanzas de tu familia.</p>
    </div>
    <div class="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 sm:mt-0">
      <!-- Currency Selector -->
      <div class="relative">
        <label for="currencySelector" class="sr-only">Seleccionar Moneda</label>
        <select
          id="currencySelector"
          v-model="selectedCurrencyModel"
          @change="onCurrencyChange"
          class="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white hover:border-gray-400"
        >
          <option v-for="currency in store.activeCurrencies" :key="currency.code" :value="currency.code">
            {{ currency.code }} - {{ currency.symbol }}
          </option>
        </select>
      </div>

      <DataImportExport />

      <nav class="flex space-x-1 sm:space-x-2 bg-slate-200 p-1 rounded-lg">
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
        <router-link
          to="/currency-settings"
          @click="handleCurrencySettingsNavigation"
          class="px-3 py-2 text-sm font-semibold rounded-md transition-colors"
          :class="$route.name === 'CurrencySettings' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:bg-slate-300'"
        >
          Monedas
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store/mainStore';
import DataImportExport from './DataImportExport.vue';

const store = useMainStore();

// Use a computed property with a setter for v-model with Pinia state
const selectedCurrencyModel = computed({
  get: () => store.selectedCurrencyCode,
  set: (value) => {
    store.setSelectedCurrencyCode(value);
  }
});

// Optional: If you need to do more than just set the code on change
const onCurrencyChange = (event) => {
  // The v-model already updates the store through the computed setter.
  // This handler can be used for additional logic if needed.
  // For example, store.reloadCurrenciesAndRates() if rates might change with currency selection,
  // though in this app, rates are independent of selected display currency.
  console.log('Selected currency changed to:', event.target.value);
};

// When navigating to currency settings, it might be good to ensure the store has the latest list of currencies.
const handleCurrencySettingsNavigation = () => {
  store.reloadCurrenciesAndRates();
};

</script>

<style scoped>
/* Using :class for active links, so router-link-exact-active might not be needed unless preferred */
a.text-slate-600.hover\:bg-slate-300.router-link-exact-active {
    /* This is an example if you wanted to target the non-active-class styled active link */
    /* For this setup, rely on the conditional :class binding and active-class is not used here */
}

/* Additional styling for the select dropdown if needed */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem; /* Adjust based on icon size and desired padding */
}
</style>
