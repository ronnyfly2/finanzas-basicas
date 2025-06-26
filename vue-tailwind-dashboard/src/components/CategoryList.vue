<template>
  <aside class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
    <h2 class="text-xl font-bold mb-4 text-slate-800">Gastos por Categoría</h2>
    <div v-if="store.totalExpense > 0" class="space-y-4">
      <div v-for="(amount, category) in store.expensesByCategory" :key="category">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium">{{ category }}</span>
          <span class="text-sm font-mono">{{ fCurrency(amount) }}</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full"
            :style="{ width: (amount / store.totalExpense * 100) + '%', backgroundColor: store.getCategoryColor(category) }"
          ></div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-slate-500">
      <p>No hay gastos registrados en el periodo seleccionado.</p>
    </div>
  </aside>
</template>

<script setup>
import { useMainStore } from '../store/mainStore';
import { formatCurrency as fCurrency } from '../utils/formatters';

const store = useMainStore();
</script>
