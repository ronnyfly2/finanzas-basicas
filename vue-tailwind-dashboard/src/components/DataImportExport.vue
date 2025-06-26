<template>
  <div class="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
    <button
      @click="handleExport"
      title="Exportar datos a un archivo JSON"
      class="bg-white hover:bg-slate-100 text-slate-600 font-semibold py-1.5 px-3 rounded-md flex items-center text-sm"
    >
      <font-awesome-icon icon="file-export" class="mr-2" />
      Exportar
    </button>
    <button
      @click="triggerImport"
      title="Importar datos desde un archivo JSON"
      class="bg-white hover:bg-slate-100 text-slate-600 font-semibold py-1.5 px-3 rounded-md flex items-center text-sm"
    >
      <font-awesome-icon icon="file-import" class="mr-2" />
      Importar
    </button>
    <input type="file" ref="fileInput" @change="onFileChange" accept=".json" class="hidden">
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '../store/mainStore';

const store = useMainStore();
const fileInput = ref(null);

const handleExport = () => {
  store.exportData(); // Action from Pinia store
};

const triggerImport = () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  store.handleFileUpload(file); // Action from Pinia store
  event.target.value = ''; // Reset file input
};
</script>
