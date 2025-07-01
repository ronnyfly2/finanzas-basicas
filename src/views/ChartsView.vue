<template>
  <div class="space-y-8">
    <DateFilter />
    <div v-if="store.totalExpense === 0" class="text-center py-16 text-slate-500 bg-white rounded-xl shadow-lg">
      <font-awesome-icon icon="chart-pie" class="fa-3x mb-4 text-slate-400" />
      <h3 class="text-xl font-bold">No hay datos de gastos para mostrar.</h3>
      <p>Añade algunas transacciones de gastos para ver los gráficos.</p>
    </div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <CategoryChart />
      <MemberChart />
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../store/mainStore';
import DateFilter from '../components/DateFilter.vue';
import CategoryChart from '../components/charts/CategoryChart.vue';
import MemberChart from '../components/charts/MemberChart.vue';

const store = useMainStore();
</script>
