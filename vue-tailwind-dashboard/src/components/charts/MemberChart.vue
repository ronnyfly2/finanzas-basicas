<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
    <h2 class="text-xl font-bold mb-4 text-slate-800">Gastos por Miembro</h2>
    <canvas ref="chartCanvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useMainStore } from '../../store/mainStore';
import Chart from 'chart.js/auto';

const store = useMainStore();
const chartCanvasRef = ref(null);
let chartInstance = null;

const renderChart = async () => {
  await nextTick();
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (!chartCanvasRef.value || Object.keys(store.expensesByMember).length === 0) return;

  const memberData = Object.keys(store.expensesByMember);
  const memberValues = Object.values(store.expensesByMember);

  chartInstance = new Chart(chartCanvasRef.value, {
    type: 'bar',
    data: {
      labels: memberData,
      datasets: [{
        label: 'Gasto Total',
        data: memberValues,
        backgroundColor: memberData.map((_, i) => `hsla(${i * 45}, 70%, 60%, 0.8)`), // Simple distinct colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false }},
      scales: { y: { beginAtZero: true }}
    }
  });
};

onMounted(renderChart);
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

watch(() => store.filteredTransactions, renderChart, { deep: true });
</script>
