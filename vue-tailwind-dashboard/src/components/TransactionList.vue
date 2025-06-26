<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-slate-800">Transacciones Recientes</h2>
      <div class="flex gap-2">
        <button
          @click="askToClearTransactions"
          v-if="store.transactions.length > 0"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center text-sm"
        >
          <font-awesome-icon icon="trash-alt" class="mr-2" />
          <span>Vaciar Lista</span>
        </button>
        <button
          @click="store.openNewTransactionForm()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center text-sm"
        >
          <font-awesome-icon icon="plus" class="mr-2" />
          <span>Añadir Transacción</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b-2 border-slate-200">
            <th class="py-3 px-2 font-semibold text-sm text-slate-500">Descripción</th>
            <th class="py-3 px-2 font-semibold text-sm text-slate-500 hidden sm:table-cell">Miembro</th>
            <th class="py-3 px-2 font-semibold text-sm text-slate-500 hidden md:table-cell">Categoría</th>
            <th class="py-3 px-2 font-semibold text-sm text-slate-500 text-right">Monto</th>
            <th class="py-3 px-2 font-semibold text-sm text-slate-500 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.groupedTransactions.length === 0">
            <td colspan="5" class="text-center py-8 text-slate-500">
              No hay transacciones en el rango seleccionado o no hay transacciones aún.
            </td>
          </tr>
          <template v-for="group in store.groupedTransactions" :key="group.date">
            <tr class="bg-slate-100 sticky top-0 z-10">
              <td colspan="5" class="py-2 px-2 text-sm font-bold text-slate-600 capitalize">
                {{ fDateHeader(group.date) }}
              </td>
            </tr>
            <tr v-for="t in group.transactions" :key="t.id" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="py-3 px-2">
                <p class="font-medium text-slate-800">{{ t.description }}</p>
                <p v-if="t.detail" class="text-xs text-slate-500 mt-1 italic">{{ t.detail }}</p>
                <span class="block sm:hidden text-xs text-slate-400 mt-1">{{ t.member }} / {{ t.category }}</span>
              </td>
              <td class="py-3 px-2 hidden sm:table-cell">{{ t.member }}</td>
              <td class="py-3 px-2 hidden md:table-cell">
                <span
                  v-if="t.type === 'expense' && t.category"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :style="{
                    backgroundColor: getCategoryStyle(store.getCategoryColor(t.category), 0.2).backgroundColor,
                    color: getCategoryStyle(store.getCategoryColor(t.category), 1).borderColor
                  }"
                >
                  {{ t.category }}
                </span>
              </td>
              <td class="py-3 px-2 text-right font-mono" :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ t.type === 'income' ? '+' : '-' }} {{ fCurrency(t.amount, false) }}
              </td>
              <td class="py-3 px-2 text-center">
                <div class="flex justify-center items-center gap-3">
                  <button @click="edit(t)" class="text-slate-400 hover:text-blue-500 transition-colors">
                    <font-awesome-icon icon="pencil-alt" />
                  </button>
                  <button @click="askToDelete(t.id)" class="text-slate-400 hover:text-red-500 transition-colors">
                    <font-awesome-icon icon="trash-alt" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '../store/mainStore';
import { formatCurrency as fCurrency, formatDateHeader as fDateHeader, getCategoryStyle } from '../utils/formatters';

const store = useMainStore();

const edit = (transaction) => store.openEditTransactionForm(transaction);

const askToDelete = (id) => {
  store.openConfirmModal(
    'Eliminar Transacción',
    '¿Estás seguro de que quieres eliminar esta transacción?',
    () => store.deleteTransaction(id)
  );
};

const askToClearTransactions = () => {
  store.openConfirmModal(
    'Vaciar Lista de Transacciones',
    '¿Estás seguro de que quieres eliminar TODAS las transacciones? Esta acción no se puede deshacer.',
    () => store.clearAllTransactions()
  );
};
</script>
