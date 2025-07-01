<template>
  <div>
    <form @submit.prevent="saveMember" class="flex flex-col sm:flex-row items-end gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
      <div class="w-full">
        <label for="memberName" class="block text-sm font-medium text-slate-600 mb-1">Nombre del Miembro</label>
        <input v-model="memberForm.name" type="text" id="memberName" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Abuela" required>
      </div>
      <div class="flex gap-2 w-full sm:w-auto shrink-0">
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex-grow">
          {{ memberForm.isEditing ? 'Actualizar' : 'Añadir' }}
        </button>
        <button v-if="memberForm.isEditing" @click="cancelEditMember" type="button" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg">
          Cancelar
        </button>
      </div>
    </form>

    <ul class="space-y-3">
      <li v-if="store.members.length === 0" class="text-center py-8 text-slate-500">
        No hay miembros añadidos.
      </li>
      <li v-for="member in store.members" :key="member" class="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm">
        <span class="font-medium text-slate-700">{{ member }}</span>
        <div class="flex gap-4">
          <button @click="editMember(member)" class="text-slate-500 hover:text-blue-600 transition-colors">
            <font-awesome-icon icon="pencil-alt" />
          </button>
          <button @click="askToDeleteMember(member)" class="text-slate-500 hover:text-red-600 transition-colors">
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
const memberForm = ref({ name: '', isEditing: false, originalName: '' });

const saveMember = () => {
  const newName = memberForm.value.name.trim();
  if (!newName) return;

  let success = false;
  if (memberForm.value.isEditing) {
    success = store.updateMember(memberForm.value.originalName, newName);
  } else {
    if (store.members.includes(newName)) {
      alert('Este miembro ya existe.');
    } else {
      store.addMember(newName);
      success = true;
    }
  }
  if (success) {
    cancelEditMember();
  }
};

const editMember = (memberName) => {
  memberForm.value.name = memberName;
  memberForm.value.originalName = memberName;
  memberForm.value.isEditing = true;
};

const cancelEditMember = () => {
  memberForm.value.name = '';
  memberForm.value.isEditing = false;
  memberForm.value.originalName = '';
};

const askToDeleteMember = (memberName) => {
  // The check for transactions associated with member is in store.deleteMember
  store.openConfirmModal(
    'Eliminar Miembro',
    `¿Estás seguro de que quieres eliminar a "${memberName}"?`,
    () => {
      store.deleteMember(memberName);
      // If current editing member is the one deleted, cancel edit mode
      if (memberForm.value.isEditing && memberForm.value.originalName === memberName) {
        cancelEditMember();
      }
    }
  );
};
</script>
