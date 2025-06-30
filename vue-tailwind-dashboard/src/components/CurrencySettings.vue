<template>
  <div class="p-4 space-y-6">
    <h2 class="text-3xl font-bold text-slate-800 mb-6">Configuración de Moneda</h2>

    <!-- Formulario para Añadir/Editar Moneda -->
    <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-lg">
      <h3 class="text-2xl font-semibold mb-4 text-slate-700">{{ isEditing ? 'Editar Moneda' : 'Añadir Nueva Moneda' }}</h3>
      <form @submit.prevent="handleCurrencySubmit" class="space-y-4">
        <div>
          <label for="currencyName" class="block text-sm font-medium text-gray-700">Nombre de la Moneda:</label>
          <input type="text" id="currencyName" v-model="currencyForm.name" required
                 class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>
        <div>
          <label for="currencyCode" class="block text-sm font-medium text-gray-700">Código (ej. USD, PEN):</label>
          <input type="text" id="currencyCode" v-model="currencyForm.code" :disabled="isEditing" required maxlength="3"
                 @input="currencyForm.code = currencyForm.code.toUpperCase()"
                 class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100">
        </div>
        <div>
          <label for="currencySymbol" class="block text-sm font-medium text-gray-700">Símbolo (ej. $, S/):</label>
          <input type="text" id="currencySymbol" v-model="currencyForm.symbol" required
                 class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>
        <div>
          <label for="currencyRate" class="block text-sm font-medium text-gray-700">Tipo de Cambio (relativo a USD):</label>
          <input type="number" id="currencyRate" v-model.number="currencyForm.exchangeRate" required step="0.0001" min="0.0001"
                 class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 :disabled="currencyForm.code === 'USD'">
           <p v-if="currencyForm.code === 'USD'" class="mt-1 text-xs text-gray-500">El tipo de cambio para USD es siempre 1.</p>
        </div>
        <div class="flex items-center space-x-3">
          <button type="submit"
                  class="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150">
            {{ isEditing ? 'Actualizar Moneda' : 'Guardar Moneda' }}
          </button>
          <button type="button" v-if="isEditing" @click="cancelEdit"
                  class="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-150">
            Cancelar
          </button>
        </div>
      </form>
      <!-- Form Feedback Message -->
      <div v-if="formMessage"
           :class="['mt-4 p-3 rounded-md text-sm', formMessageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']"
           role="alert">
        {{ formMessage }}
      </div>
    </div>

    <!-- Lista de Monedas Activas -->
    <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-lg">
      <h3 class="text-2xl font-semibold mb-4 text-slate-700">Monedas Activas</h3>
      <!-- List Feedback Message -->
      <div v-if="listMessage"
           :class="['mb-4 p-3 rounded-md text-sm', listMessageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']"
           role="alert">
        {{ listMessage }}
      </div>
      <div v-if="activeCurrencies.length > 0" class="space-y-3">
        <div v-for="currency in activeCurrencies" :key="currency.code"
             class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-gray-50">
          <div class="mb-2 sm:mb-0">
            <span class="font-semibold text-lg text-slate-800">{{ currency.name }} ({{ currency.symbol }}) - {{ currency.code }}</span>
            <p class="text-sm text-gray-600">Tipo de Cambio vs USD: {{ currency.exchangeRate }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="startEditCurrency(currency)" :disabled="currency.code === 'USD' && !allowEditUSD"
                    class="px-4 py-1.5 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ease-in-out duration-150">
              Editar Tasa
            </button>
             <button @click="startEditCurrency(currency, true)" :disabled="currency.code === 'USD'"
                    class="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150">
              Editar Todo
            </button>
            <button @click="confirmDeleteCurrency(currency.code)" :disabled="currency.code === 'USD' || activeCurrencies.length <= 1"
                    class="px-4 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition ease-in-out duration-150">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No hay monedas activas configuradas. Añade una para empezar.</p>
    </div>
     <!-- Confirmation Modal Placeholder - Assuming global modal or implement local one -->
    <div v-if="showConfirmDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        <p class="my-4">¿Estás seguro de que quieres eliminar la moneda {{ currencyToDeleteCode }}? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showConfirmDeleteModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
          <button @click="executeDeleteCurrency" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'; // computed was not used
import {
  loadActiveCurrencies,
  addCurrency as storageAddCurrency,
  updateCurrency as storageUpdateCurrency,
  deleteCurrency as storageDeleteCurrency,
  // loadExchangeRates, // Keep if direct manipulation of rates outside currency objects is needed
  // saveExchangeRates // Keep for similar reasons
} from '@/services/localStorageService';

const activeCurrencies = ref([]);
const isEditing = ref(false);
const editingFullCurrency = ref(false); // To distinguish between editing only rate vs all details
const currencyForm = reactive({
  id: null, // Not strictly needed if code is the unique ID
  name: '',
  code: '',
  symbol: '',
  exchangeRate: 1,
  originalCode: '' // To keep track of the original code when editing, in case code itself becomes editable (not recommended for primary key)
});

const showConfirmDeleteModal = ref(false);
const currencyToDeleteCode = ref('');
const allowEditUSD = ref(false); // For future, if we want to allow editing USD name/symbol but not code/rate

// Form and List messages
const formMessage = ref('');
const formMessageType = ref(''); // 'success' or 'error'
const listMessage = ref('');
const listMessageType = ref(''); // 'success' or 'error'

const loadCurrencies = () => {
  activeCurrencies.value = loadActiveCurrencies();
  // If USD is not present, add it. This ensures base currency exists.
  if (!activeCurrencies.value.find(c => c.code === 'USD')) {
    const usdBase = { name: 'US Dollar', code: 'USD', symbol: '$', exchangeRate: 1.0 };
    // This assumes storageAddCurrency can handle this initial setup or we bypass it for bootstrap
    storageAddCurrency(usdBase); // This will also save it
    activeCurrencies.value.push(usdBase); // Add to local ref too
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingFullCurrency.value = false;
  currencyForm.name = '';
  currencyForm.code = '';
  currencyForm.symbol = '';
  currencyForm.exchangeRate = 1;
  currencyForm.originalCode = '';
  formMessage.value = ''; // Clear form messages on reset
  formMessageType.value = '';
};

const handleCurrencySubmit = () => {
  formMessage.value = ''; // Clear previous messages
  formMessageType.value = '';

  if (currencyForm.code === 'USD') {
    currencyForm.exchangeRate = 1.0; // Ensure USD rate is always 1
  }
  if (currencyForm.exchangeRate <= 0) {
    // alert("El tipo de cambio debe ser un número positivo.");
    formMessage.value = "El tipo de cambio debe ser un número positivo.";
    formMessageType.value = 'error';
    return;
  }

  const currencyData = {
    name: currencyForm.name,
    code: currencyForm.code,
    symbol: currencyForm.symbol,
    exchangeRate: parseFloat(currencyForm.exchangeRate.toFixed(4)) // Store with fixed precision
  };

  let success = false;
  if (isEditing.value) {
    const codeToUpdate = editingFullCurrency.value ? currencyForm.code : currencyForm.originalCode;
    success = storageUpdateCurrency({ ...currencyData, code: codeToUpdate });
  } else {
    if (activeCurrencies.value.find(c => c.code === currencyData.code)) {
      // alert(`El código de moneda ${currencyData.code} ya existe.`);
      formMessage.value = `El código de moneda ${currencyData.code} ya existe.`;
      formMessageType.value = 'error';
      return;
    }
    success = storageAddCurrency(currencyData);
  }

  if (success) {
    loadCurrencies();
    if (!isEditing.value) { // Only reset form fully if adding new, not on successful edit
        resetForm(); // Resets formMessage as well
    }
    formMessage.value = isEditing.value ? 'Moneda actualizada con éxito.' : 'Moneda añadida con éxito.';
    formMessageType.value = 'success';
    if(isEditing.value) { // If was editing, clear edit state
        isEditing.value = false;
        editingFullCurrency.value = false;
        // Form fields will retain edited values until user starts new edit or adds new
        // Or we can explicitly call resetForm() here too if preferred
        // For now, let's clear them to avoid confusion
        currencyForm.name = '';
        currencyForm.code = '';
        currencyForm.symbol = '';
        currencyForm.exchangeRate = 1;
        currencyForm.originalCode = '';
    }
  } else {
    formMessage.value = isEditing.value ? "Error al actualizar la moneda." : "Error al añadir la moneda. El código podría ya existir o hubo otro problema.";
    formMessageType.value = 'error';
  }
  setTimeout(() => {
    formMessage.value = '';
    formMessageType.value = '';
  }, 5000); // Increased timeout for better readability
};

const startEditCurrency = (currency, fullEdit = false) => {
  formMessage.value = ''; // Clear any previous form messages when starting an edit
  formMessageType.value = '';
  isEditing.value = true;
  editingFullCurrency.value = fullEdit;
  currencyForm.originalCode = currency.code; // Store original code for reference
  currencyForm.name = currency.name;
  currencyForm.code = currency.code; // Code is not editable to maintain integrity
  currencyForm.symbol = currency.symbol;
  currencyForm.exchangeRate = currency.exchangeRate;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteCurrency = (code) => {
  currencyToDeleteCode.value = code;
  showConfirmDeleteModal.value = true;
};

const executeDeleteCurrency = () => {
  const success = storageDeleteCurrency(currencyToDeleteCode.value);
  if (success) {
    loadCurrencies();
  } else {
    // Alert is typically handled by storageDeleteCurrency
    // alert("Error al eliminar la moneda. Verifique que no esté en uso o sea la moneda base.");
  }
  showConfirmDeleteModal.value = false;
  currencyToDeleteCode.value = '';
  listMessage.value = ''; // Clear message
  listMessageType.value = '';

  setTimeout(() => {
    listMessage.value = '';
    listMessageType.value = '';
  }, 5000);
};


onMounted(() => {
  loadCurrencies();
  // Initialize with USD if not present (already in loadCurrencies)
  // This ensures that if localStorage is empty, USD is added and displayed.
});

</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
input:disabled {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #6b7280; /* text-gray-500 */
}
</style>
