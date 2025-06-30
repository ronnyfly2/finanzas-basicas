<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
    <div class="flex items-center">
      <div class="p-3 rounded-full" :class="iconBgColor">
        <font-awesome-icon :icon="icon" class="fa-lg" :class="iconTextColor" />
      </div>
      <div class="ml-4">
        <h3 class="text-sm font-medium text-slate-500">{{ title }}</h3>
        <p class="text-2xl font-bold" :class="valueTextColor">{{ formattedValue }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store/mainStore';
import { formatCurrency } from '../utils/formatters';

const store = useMainStore();

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true }, // Assumed to be in a consistent currency, see note below
  // This prop indicates the currency of the 'value' passed to this card.
  // For totals like 'Total Income', this would be the currency in which that total was calculated.
  // Defaulting to 'PEN' as a placeholder, but ideally, the store's total calculation should be currency-aware.
  valueCurrencyCode: { type: String, default: 'PEN' },
  icon: { type: String, required: true },
  iconBgColor: { type: String, default: 'bg-slate-100' },
  iconTextColor: { type: String, default: 'text-slate-600' },
  valueTextColor: { type: String, default: 'text-slate-800' },
  isCurrency: { type: Boolean, default: true } // Renamed from 'currency' to 'isCurrency' for clarity
});

const formattedValue = computed(() => {
  if (props.isCurrency) {
    // The `props.value` for StatsCard (totalIncome, totalExpense, balance)
    // are calculated in `mainStore.js`. These calculations currently sum up transaction amounts
    // naively. For true multi-currency, these totals should be calculated based on a single
    // base currency (e.g., all transactions converted to USD, summed, then that sum is passed as 'value',
    // and 'valueCurrencyCode' would be 'USD').
    // Here, we're formatting `props.value` (assumed to be in `props.valueCurrencyCode`)
    // into the `store.selectedCurrencyCode`.
    return formatCurrency(
      props.value,
      props.valueCurrencyCode, // The original currency of the 'value' prop
      store.selectedCurrencyCode, // The target display currency
      store.activeCurrencies,
      store.exchangeRates
    );
  }
  // Fallback for non-currency values if any
  return props.value.toLocaleString(store.selectedCurrency?.locale || 'es-PE'); // Use selected currency locale or default
});
</script>
