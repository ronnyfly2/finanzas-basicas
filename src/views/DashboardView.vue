<template>
  <div class="space-y-8">
    <DateFilter v-if="!store.showTransactionForm" /> <!-- Hide filter when form is shown, or handle layout differently -->

    <!-- Only render sections requiring currency data once store indicates readiness -->
    <div v-if="store.activeCurrencies && store.activeCurrencies.length > 0 && store.exchangeRates && Object.keys(store.exchangeRates).length > 0" class="space-y-8">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Ingresos Totales"
          :value="store.totalIncome"
          valueCurrencyCode="PEN"
          icon="fa-solid fa-arrow-up"
          icon-bg-color="bg-green-100"
          icon-text-color="text-green-600"
          value-text-color="text-green-600"
        />
        <StatsCard
          title="Gastos Totales"
          :value="store.totalExpense"
          valueCurrencyCode="PEN"
          icon="fa-solid fa-arrow-down"
          icon-bg-color="bg-red-100"
          icon-text-color="text-red-600"
          value-text-color="text-red-600"
        />
        <StatsCard
          title="Balance Actual"
          :value="store.balance"
          valueCurrencyCode="PEN"
          icon="fa-solid fa-wallet"
          icon-bg-color="bg-blue-100"
          icon-text-color="text-blue-600"
          :value-text-color="store.balance < 0 ? 'text-red-600' : 'text-green-600'"
        />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <TransactionList />
        </div>
        <CategoryList />
      </div>
    </div>
    <!-- Loading state -->
    <div v-else class="text-center py-10">
      <p class="text-slate-500 text-lg">Cargando datos de moneda...</p>
      <!-- Optional: Add a spinner icon here -->
      <!-- <font-awesome-icon icon="fa-solid fa-spinner" spin size="2x" class="text-slate-400 mt-4" /> -->
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../store/mainStore';
import DateFilter from '../components/DateFilter.vue';
import StatsCard from '../components/StatsCard.vue';
import TransactionList from '../components/TransactionList.vue';
import CategoryList from '../components/CategoryList.vue';

const store = useMainStore();
</script>
