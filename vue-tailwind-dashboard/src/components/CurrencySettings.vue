<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Configuración de Moneda</h2>

    <div class="mb-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 class="text-xl font-medium mb-2">Monedas Activas</h3>
      <div v-for="currency in activeCurrencies" :key="currency.code" class="flex justify-between items-center mb-2 p-2 border-b last:border-b-0">
        <span>{{ currency.name }} ({{ currency.symbol }}) - {{ currency.code }}</span>
        <span>Tipo de Cambio: {{ currency.exchangeRate }}</span>
      </div>
      <p v-if="activeCurrencies.length === 0" class="text-gray-500">No hay monedas activas configuradas.</p>
    </div>

    <div class="p-4 border rounded-lg shadow-sm bg-white">
      <h3 class="text-xl font-medium mb-2">Actualizar Tipos de Cambio (Simulado)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="penRate" class="block text-sm font-medium text-gray-700">USD a PEN:</label>
          <input
            type="number"
            id="penRate"
            v-model.number="exchangeRates.PEN"
            @input="updateExchangeRate('PEN', exchangeRates.PEN)"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            step="0.001"
          />
        </div>
        <div>
          <label for="usdReference" class="block text-sm font-medium text-gray-700">USD (Referencia):</label>
          <input
            type="number"
            id="usdReference"
            value="1"
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            disabled
          />
        </div>
      </div>
       <p class="mt-2 text-sm text-gray-600">
        Nota: Los cambios se guardan automáticamente en localStorage. La moneda base para los tipos de cambio es USD.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  loadActiveCurrencies,
  saveActiveCurrencies,
  loadExchangeRates,
  saveExchangeRates
} from '@/services/localStorageService';

const activeCurrencies = ref([]);
const exchangeRates = ref({}); // Inicializar vacío, se carga en onMounted

const loadSettings = () => {
  const loadedCurrencies = loadActiveCurrencies();
  const loadedRates = loadExchangeRates();

  activeCurrencies.value = loadedCurrencies;
  exchangeRates.value = loadedRates;

  // Sincronizar las tasas de activeCurrencies con las de exchangeRates
  // Esto es importante si las tasas en localStorage para 'activeCurrencies' y 'exchangeRates' pudieran desincronizarse.
  // O, alternativamente, considerar que 'exchangeRates' es la fuente de verdad para las tasas.
  activeCurrencies.value.forEach(currency => {
    if (exchangeRates.value[currency.code] !== undefined) {
      currency.exchangeRate = exchangeRates.value[currency.code];
    } else {
      // Si una moneda activa no tiene una tasa definida en exchangeRates,
      // podríamos asignarle un valor por defecto o manejarlo como un error.
      // Por ahora, la dejaremos como esté si vino de loadActiveCurrencies.
      // Si exchangeRates no tenía esta moneda, la añadimos con la tasa de activeCurrencies.
      exchangeRates.value[currency.code] = currency.exchangeRate;
    }
  });
  // Guardar activeCurrencies puede ser redundante si no se cambió nada, pero asegura consistencia.
  saveActiveCurrencies(activeCurrencies.value);
  saveExchangeRates(exchangeRates.value); // Asegura que exchangeRates se guarde si se añadió alguna nueva moneda desde activeCurrencies
};

const updateExchangeRate = (currencyCode, newRate) => {
  if (typeof newRate !== 'number' || newRate <= 0) {
    // Opcional: añadir validación o feedback al usuario
    console.warn(`Tasa de cambio inválida para ${currencyCode}: ${newRate}`);
    // Restaurar la tasa anterior si es posible o manejar el error
    exchangeRates.value[currencyCode] = loadExchangeRates()[currencyCode] || 1; //Fallback a 1 si no existe
    return;
  }

  // Actualizar la tasa en exchangeRates
  exchangeRates.value[currencyCode] = newRate;

  // Actualizar la tasa en la lista activeCurrencies
  const currencyToUpdate = activeCurrencies.value.find(c => c.code === currencyCode);
  if (currencyToUpdate) {
    currencyToUpdate.exchangeRate = newRate;
  } else {
    // Esto no debería ocurrir si activeCurrencies está sincronizado
    console.warn(`Moneda ${currencyCode} no encontrada en activeCurrencies para actualizar tasa.`);
  }

  // Guardar ambos actualizados
  saveExchangeRates(exchangeRates.value);
  saveActiveCurrencies(activeCurrencies.value); // activeCurrencies también se actualizó
};

onMounted(() => {
  loadSettings();
});

// Observar cambios en exchangeRates para persistirlos (si se modifican externamente o por otras funciones)
// En este caso, updateExchangeRate ya se encarga de guardar.
// Sin embargo, si quisiéramos que el input v-model.number="exchangeRates.PEN" guardara directamente
// sin el @input, este watcher sería útil. Con la configuración actual, es redundante.
// watch(exchangeRates, (newRates) => {
//   saveExchangeRates(newRates);
//   // Podríamos necesitar re-sincronizar activeCurrencies aquí también si el watcher se activa
//   // por cambios que no pasaron por updateExchangeRate.
// }, { deep: true });

</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>
