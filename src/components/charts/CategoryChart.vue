<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
    <h2 class="text-xl font-bold mb-4 text-slate-800">Gastos por Categoría</h2>
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
  if (!chartCanvasRef.value || Object.keys(store.expensesByCategory).length === 0) return;

  const categoryData = Object.keys(store.expensesByCategory);
  const categoryValues = Object.values(store.expensesByCategory);

  const backgroundColors = categoryData.map(cat => {
    const hexColor = store.getCategoryColor(cat);
    let r=0,g=0,b=0;
    if(hexColor.length==7){r=parseInt(hexColor.substring(1,3),16);g=parseInt(hexColor.substring(3,5),16);b=parseInt(hexColor.substring(5,7),16);}
    else if (hexColor.length==4){r=parseInt(hexColor.substring(1,2)+hexColor.substring(1,2),16);g=parseInt(hexColor.substring(2,3)+hexColor.substring(2,3),16);b=parseInt(hexColor.substring(3,4)+hexColor.substring(3,4),16);}
    return `rgba(${r},${g},${b},0.8)`;
  });

  chartInstance = new Chart(chartCanvasRef.value, {
    type: 'doughnut',
    data: {
      labels: categoryData,
      datasets: [{
        data: categoryValues,
        backgroundColor: backgroundColors,
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Or false depending on desired behavior
      plugins: { legend: { position: 'bottom' }}
    }
  });
};

onMounted(renderChart);
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

// Watch for changes in filtered transactions or categories (which might change colors)
watch(() => [store.filteredTransactions, store.categories], renderChart, { deep: true });
</script>
