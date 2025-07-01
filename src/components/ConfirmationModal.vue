<template>
  <transition name="fade">
    <div
      v-if="store.showConfirmModal"
      @click.self="store.closeConfirmModal()"
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
    >
      <transition name="slide-fade">
        <div v-if="store.showConfirmModal" class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
          <h3 class="text-xl font-bold mb-4 text-slate-800">{{ store.confirmModalProps.title }}</h3>
          <p class="text-slate-600 mb-6">{{ store.confirmModalProps.message }}</p>
          <div class="flex justify-center space-x-4">
            <button
              @click="store.closeConfirmModal()"
              class="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirm"
              class="px-6 py-2 text-white font-semibold rounded-lg shadow-sm"
              :class="confirmButtonClass"
            >
              Confirmar
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../store/mainStore';

const store = useMainStore();

const handleConfirm = () => {
  store.executeConfirm();
};

// Optional: Add dynamic styling for confirm button based on action type (e.g., delete vs. generic confirm)
const confirmButtonClass = computed(() => {
  // Example: make button red if title includes 'Eliminar' or 'Vaciar'
  const title = store.confirmModalProps.title.toLowerCase();
  if (title.includes('eliminar') || title.includes('vaciar') || title.includes('delete')) {
    return 'bg-red-600 hover:bg-red-700';
  }
  return 'bg-blue-600 hover:bg-blue-700'; // Default confirm color
});
</script>
