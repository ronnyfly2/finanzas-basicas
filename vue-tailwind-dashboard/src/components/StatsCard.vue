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
import { formatCurrency } from '../utils/formatters';

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  icon: { type: String, required: true },
  iconBgColor: { type: String, default: 'bg-slate-100' },
  iconTextColor: { type: String, default: 'text-slate-600' },
  valueTextColor: { type: String, default: 'text-slate-800' },
  currency: { type: Boolean, default: true }
});

const formattedValue = computed(() => {
  if (props.currency) {
    return formatCurrency(props.value);
  }
  return props.value.toLocaleString('es-PE');
});
</script>
