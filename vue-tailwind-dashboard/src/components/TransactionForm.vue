<template>
  <transition name="fade">
    <div
      v-if="store.showTransactionForm"
      @click.self="store.showTransactionForm = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4"
    >
      <transition name="slide-fade">
        <div v-if="store.showTransactionForm" class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg">
          <h2 class="text-2xl font-bold mb-6 text-slate-800">
            {{ store.transactionForm.isEditing ? 'Editar' : 'Nueva' }} Transacción
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
              <input v-model="formData.description" type="text" id="description" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Compra del supermercado" required>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="amount" class="block text-sm font-medium text-slate-600 mb-1">Monto</label>
                <input v-model.number="formData.amount" type="number" step="0.01" id="amount" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" required>
              </div>
              <div>
                <label for="date" class="block text-sm font-medium text-slate-600 mb-1">Fecha</label>
                <input v-model="formData.date" type="date" id="date" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
              </div>
            </div>
            <div class="mb-4">
              <label for="currency" class="block text-sm font-medium text-slate-600 mb-1">Moneda</label>
              <select v-model="formData.currency" id="currency" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                <option v-for="currency in activeCurrencies" :key="currency.code" :value="currency.code">
                  {{ currency.name }} ({{ currency.symbol }})
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="detail" class="block text-sm font-medium text-slate-600 mb-1">Detalle (Opcional)</label>
              <textarea v-model="formData.detail" id="detail" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Añade notas adicionales aquí..."></textarea>
            </div>
            <div class="mb-4">
              <span class="block text-sm font-medium text-slate-600 mb-2">Tipo</span>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input v-model="formData.type" type="radio" value="expense" name="type" class="form-radio h-4 w-4 text-red-600 border-slate-300 focus:ring-red-500">
                  <span class="ml-2 text-red-700 font-semibold">Gasto</span>
                </label>
                <label class="flex items-center">
                  <input v-model="formData.type" type="radio" value="income" name="type" class="form-radio h-4 w-4 text-green-600 border-slate-300 focus:ring-green-500">
                  <span class="ml-2 text-green-700 font-semibold">Ingreso</span>
                </label>
              </div>
            </div>
            <div v-if="formData.type === 'expense'" class="mb-4">
              <label for="category" class="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
              <select v-model="formData.category" id="category" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                <option disabled value="">Selecciona una categoría</option>
                <option v-for="cat in store.categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
            <div class="mb-6">
              <label for="member" class="block text-sm font-medium text-slate-600 mb-1">Miembro</label>
              <select v-model="formData.member" id="member" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                <option disabled value="">Selecciona un miembro</option>
                <option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <button @click="store.showTransactionForm = false" type="button" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm">Guardar</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useMainStore } from '../store/mainStore';
import { loadActiveCurrencies } from '@/services/localStorageService'; // Corregido

const store = useMainStore();

const activeCurrencies = ref([]);

onMounted(() => {
  // Cargar monedas activas usando la función específica
  activeCurrencies.value = loadActiveCurrencies();

  // Asegurar que el formData tenga una moneda por defecto si no la tiene
  // y si hay monedas activas disponibles.
  if (!formData.value.currency && activeCurrencies.value && activeCurrencies.value.length > 0) {
    // Intentar preseleccionar PEN, o la primera disponible de las cargadas
    const defaultCurrency = activeCurrencies.value.find(c => c.code === 'PEN') || activeCurrencies.value[0];
    if (defaultCurrency) {
      formData.value.currency = defaultCurrency.code;
    }
  } else if (!formData.value.currency) {
    // Si no hay monedas en localStorage Y formData no tiene moneda,
    // podríamos asignar un valor por defecto absoluto aquí, aunque es mejor
    // que loadActiveCurrencies siempre devuelva un array (incluso con defaults).
    // Por ahora, TransactionForm dependerá de que loadActiveCurrencies proporcione defaults.
    console.warn("No hay monedas activas cargadas y formData no tiene moneda preseleccionada.");
  }
});

// Use a local ref for form data, synced with the store's transactionForm
// This allows local modifications without directly mutating store state outside actions/mutations,
// and also allows for easier reset/initialization.
const formData = ref({});

// Watch for changes in the store's transactionForm (e.g., when opening for edit)
// and update the local formData.
watch(() => store.transactionForm, (newFormState) => {
  formData.value = { ...newFormState }; // Create a copy
  // If editing an old transaction that doesn't have a currency, default it
  if (newFormState.isEditing && !formData.value.currency && activeCurrencies.value.length > 0) {
    const defaultCurrency = activeCurrencies.value.find(c => c.code === 'PEN') || activeCurrencies.value[0];
    if (defaultCurrency) {
      formData.value.currency = defaultCurrency.code;
    }
  }
}, { deep: true, immediate: true }); // immediate to set initial state

// Also, if the form is closed, we might want to reset the local formData
// or rely on store.transactionForm being reset when opened.
// The current store logic resets transactionForm when openNewTransactionForm is called.

const handleSubmit = () => {
  // Update the store's transactionForm with the local formData before saving
  // This step ensures that the store action has the latest data from the form.
  // Alternatively, the store action could accept formData as a payload.
  store.transactionForm.description = formData.value.description;
  store.transactionForm.amount = formData.value.amount;
  store.transactionForm.date = formData.value.date;
  store.transactionForm.detail = formData.value.detail;
  store.transactionForm.type = formData.value.type;
  store.transactionForm.category = formData.value.type === 'income' ? '' : formData.value.category; // Clear category for income
  store.transactionForm.member = formData.value.member;
  store.transactionForm.currency = formData.value.currency; // Guardar la moneda
  // ID and isEditing are already part of store.transactionForm

  store.saveTransaction();
  // The store action will set showTransactionForm to false
};
</script>
