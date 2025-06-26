<template>
  <div>
    <form @submit.prevent="saveCategory" class="flex flex-col sm:flex-row items-end gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
      <div class="w-full">
        <label for="categoryName" class="block text-sm font-medium text-slate-600 mb-1">Nombre de la Categoría</label>
        <input v-model="categoryForm.name" type="text" id="categoryName" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Supermercado" required>
      </div>
      <div class="w-full sm:w-auto">
        <label for="categoryColor" class="block text-sm font-medium text-slate-600 mb-1">Color</label>
        <input v-model="categoryForm.color" type="color" id="categoryColor" class="w-full h-10 px-1 py-1 border border-slate-300 rounded-lg cursor-pointer">
      </div>
      <div class="flex gap-2 w-full sm:w-auto shrink-0">
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex-grow">
          {{ categoryForm.isEditing ? 'Actualizar' : 'Añadir' }}
        </button>
        <button v-if="categoryForm.isEditing" @click="cancelEditCategory" type="button" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg">
          Cancelar
        </button>
      </div>
    </form>

    <ul class="space-y-3">
      <li v-if="store.categories.length === 0" class="text-center py-8 text-slate-500">
        No hay categorías añadidas.
      </li>
      <li v-for="cat in store.categories" :key="cat.name" class="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm">
        <div class="flex items-center gap-3">
          <span class="block w-5 h-5 rounded-full border border-slate-200" :style="{ backgroundColor: cat.color }"></span>
          <span class="font-medium text-slate-700">{{ cat.name }}</span>
        </div>
        <div class="flex gap-4">
          <button @click="editCategory(cat)" class="text-slate-500 hover:text-blue-600 transition-colors">
            <font-awesome-icon icon="pencil-alt" />
          </button>
          <button @click="askToDeleteCategory(cat.name)" class="text-slate-500 hover:text-red-600 transition-colors">
            <font-awesome-icon icon="trash-alt" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '../store/mainStore';

const store = useMainStore();
const categoryForm = ref({ name: '', color: '#94a3b8', isEditing: false, originalName: '' });

const defaultColor = '#94a3b8';

const saveCategory = () => {
  const newName = categoryForm.value.name.trim();
  if (!newName) return;

  const categoryData = { name: newName, color: categoryForm.value.color || defaultColor };

  let success = false;
  if (categoryForm.value.isEditing) {
    success = store.updateCategory(categoryForm.value.originalName, categoryData);
  } else {
     if (store.categories.some(c => c.name === newName)) {
      alert('Ese nombre de categoría ya existe.');
    } else {
      store.addCategory(categoryData);
      success = true;
    }
  }

  if (success) {
    cancelEditCategory();
  }
};

const editCategory = (category) => {
  categoryForm.value.name = category.name;
  categoryForm.value.color = category.color || defaultColor;
  categoryForm.value.originalName = category.name;
  categoryForm.value.isEditing = true;
};

const cancelEditCategory = () => {
  categoryForm.value.name = '';
  categoryForm.value.color = defaultColor;
  categoryForm.value.isEditing = false;
  categoryForm.value.originalName = '';
};

const askToDeleteCategory = (categoryName) => {
  store.openConfirmModal(
    'Eliminar Categoría',
    `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`,
    () => {
      store.deleteCategory(categoryName);
      if (categoryForm.value.isEditing && categoryForm.value.originalName === categoryName) {
        cancelEditCategory();
      }
    }
  );
};
</script>
