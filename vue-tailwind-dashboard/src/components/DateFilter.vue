<template>
  <section class="bg-white p-4 rounded-xl shadow-lg border border-slate-200 mb-8 flex flex-col sm:flex-row items-center gap-4">
    <h3 class="text-sm font-bold text-slate-600 shrink-0">Filtrar por Fecha:</h3>
    <div class="flex items-center gap-2 w-full">
      <label for="filterStartDate" class="text-sm font-medium">Desde:</label>
      <input
        type="date"
        v-model="startDate"
        id="filterStartDate"
        class="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
    </div>
    <div class="flex items-center gap-2 w-full">
      <label for="filterEndDate" class="text-sm font-medium">Hasta:</label>
      <input
        type="date"
        v-model="endDate"
        id="filterEndDate"
        class="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
    </div>
    <button
      @click="resetFilters"
      class="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm"
    >
      Limpiar
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../store/mainStore';

const store = useMainStore();

// Create computed properties with getters and setters to bind to store state
const startDate = computed({
  get: () => store.filterStartDate,
  set: (value) => store.filterStartDate = value
});

const endDate = computed({
  get: () => store.filterEndDate,
  set: (value) => store.filterEndDate = value
});

const resetFilters = () => {
  store.resetDateFilters();
};
</script>
