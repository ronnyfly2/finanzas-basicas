import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import * as storage from '../services/localStorageService'; // Using * as storage

export const useMainStore = defineStore('main', () => {
  // --- STATE ---
  const transactions = ref(storage.loadTransactions());
  const members = ref(storage.loadMembers());
  const categories = ref(storage.loadCategories());

  const filterStartDate = ref('');
  const filterEndDate = ref('');

  // --- MODAL & FORM STATE (Consider if these should be global or local) ---
  // For now, keeping transaction form visibility global as it was in original App.vue concept
  const showTransactionForm = ref(false);
  const transactionFormInitialState = () => ({
    id: null, description: '', amount: null, type: 'expense', category: '', member: '',
    date: new Date().toISOString().slice(0, 10), detail: '', isEditing: false,
  });
  const transactionForm = ref(transactionFormInitialState());

  const showConfirmModal = ref(false);
  const confirmModalProps = ref({ title: '', message: '', onConfirm: () => {} });

  // --- WATCHERS FOR PERSISTENCE ---
  watch(transactions, (newTransactions) => {
    storage.saveTransactions(newTransactions);
  }, { deep: true });

  watch(members, (newMembers) => {
    storage.saveMembers(newMembers);
  }, { deep: true });

  watch(categories, (newCategories) => {
    storage.saveCategories(newCategories);
  }, { deep: true });

  // --- COMPUTED ---
  const filteredTransactions = computed(() => {
    return transactions.value.filter(t => {
      const transactionDate = new Date(t.date);
      const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
      const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
      if (startDate) startDate.setUTCHours(0, 0, 0, 0);
      if (endDate) endDate.setUTCHours(23, 59, 59, 999);
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  });

  const totalIncome = computed(() =>
    filteredTransactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const totalExpense = computed(() =>
    filteredTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const balance = computed(() => totalIncome.value - totalExpense.value);

  const expensesByCategory = computed(() => {
    return filteredTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
  });

  const expensesByMember = computed(() => {
    return filteredTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.member] = (acc[t.member] || 0) + Number(t.amount);
        return acc;
      }, {});
  });

  const groupedTransactions = computed(() => {
    // Assuming filteredTransactions is already sorted by date descending
    const groups = filteredTransactions.value.reduce((acc, transaction) => {
        const date = transaction.date; // Already YYYY-MM-DD
        if (!acc[date]) acc[date] = [];
        acc[date].push(transaction);
        return acc;
    }, {});
    return Object.keys(groups)
        .sort((a,b) => new Date(b) - new Date(a)) // Sort dates descending
        .map(date => ({ date: date, transactions: groups[date] }));
  });


  // --- ACTIONS ---
  // Transaction Actions
  const openNewTransactionForm = () => {
    transactionForm.value = transactionFormInitialState();
    showTransactionForm.value = true;
  };

  const openEditTransactionForm = (transaction) => {
    transactionForm.value = { ...transaction, isEditing: true };
    showTransactionForm.value = true;
  };

  const saveTransaction = () => {
    const form = transactionForm.value;
    // Basic validation
    if (!form.description || !form.amount || !form.member || !form.date) return;
    if (form.type === 'expense' && !form.category) return;

    const newTransaction = { ...form, amount: Number(form.amount) };
    if (form.isEditing) {
      const index = transactions.value.findIndex(t => t.id === form.id);
      if (index !== -1) {
        transactions.value[index] = newTransaction;
      }
    } else {
      transactions.value.unshift({ ...newTransaction, id: Date.now() });
    }
    showTransactionForm.value = false;
  };

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id);
  };

  const clearAllTransactions = () => {
    transactions.value = [];
  };

  // Member Actions
  const addMember = (name) => {
    if (name && !members.value.includes(name)) {
      members.value.push(name);
    }
  };
  const updateMember = (oldName, newName) => {
    if (!newName || oldName === newName) return;
    if (members.value.includes(newName)) {
      alert('Este nombre de miembro ya existe.'); return false;
    }
    const index = members.value.findIndex(m => m === oldName);
    if (index !== -1) {
      members.value[index] = newName;
      // Update transactions
      transactions.value.forEach(t => {
        if (t.member === oldName) t.member = newName;
      });
    }
    return true;
  };
  const deleteMember = (name) => {
    if (transactions.value.some(t => t.member === name)) {
      alert(`No se puede eliminar a "${name}" porque tiene transacciones asociadas.`);
      return false;
    }
    members.value = members.value.filter(m => m !== name);
    return true;
  };

  // Category Actions
  const addCategory = (category) => { // category is { name, color }
    if (category.name && !categories.value.some(c => c.name === category.name)) {
      categories.value.push(category);
    }
  };
  const updateCategory = (oldName, newCategory) => { // newCategory is { name, color }
     if (!newCategory.name) return false;
    if (oldName !== newCategory.name && categories.value.some(c => c.name === newCategory.name)) {
      alert('Ese nombre de categoría ya existe.'); return false;
    }
    const categoryToUpdate = categories.value.find(c => c.name === oldName);
    if (categoryToUpdate) {
      categoryToUpdate.name = newCategory.name;
      categoryToUpdate.color = newCategory.color;
      transactions.value.forEach(t => {
        if (t.category === oldName) t.category = newCategory.name;
      });
    }
    return true;
  };
  const deleteCategory = (name) => {
    if (transactions.value.some(t => t.type === 'expense' && t.category === name)) {
      alert(`No se puede eliminar "${name}" porque tiene transacciones asociadas.`);
      return false;
    }
    categories.value = categories.value.filter(c => c.name !== name);
    return true;
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.value.find(c => c.name === categoryName);
    return category ? category.color : '#94a3b8'; // Default color
  };


  // Filter Actions
  const resetDateFilters = () => {
    filterStartDate.value = '';
    filterEndDate.value = '';
  };

  // Confirmation Modal Actions
  const openConfirmModal = (title, message, onConfirmAction) => {
    confirmModalProps.value = { title, message, onConfirm: onConfirmAction };
    showConfirmModal.value = true;
  };
  const closeConfirmModal = () => {
    showConfirmModal.value = false;
  };
  const executeConfirm = () => {
    if (confirmModalProps.value.onConfirm) {
      confirmModalProps.value.onConfirm();
    }
    closeConfirmModal();
  };

  // Import/Export
  const handleFileUpload = (file) => {
    // This function will read the file and then likely call another action to process the data
    // For example, it might parse the JSON and then call openConfirmModal
    // The actual file reading logic might be better in the component, passing the parsed data to an action
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData && importedData.transactions && importedData.members && importedData.categories) {
                openConfirmModal(
                    'Importar Datos',
                    'Esto reemplazará todos los datos actuales. ¿Deseas continuar?',
                    () => {
                        transactions.value = importedData.transactions || [];
                        members.value = importedData.members || [];
                        categories.value = importedData.categories || [];
                        // Data will be saved by watchers
                    }
                );
            } else {
                alert('El archivo no tiene el formato correcto.');
            }
        } catch (error) {
            alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
        }
    };
    reader.readAsText(file);
  };


  return {
    transactions, members, categories, filterStartDate, filterEndDate,
    showTransactionForm, transactionForm, transactionFormInitialState,
    showConfirmModal, confirmModalProps,
    filteredTransactions, totalIncome, totalExpense, balance, expensesByCategory, expensesByMember, groupedTransactions,
    openNewTransactionForm, openEditTransactionForm, saveTransaction, deleteTransaction, clearAllTransactions,
    addMember, updateMember, deleteMember,
    addCategory, updateCategory, deleteCategory, getCategoryColor,
    resetDateFilters,
    openConfirmModal, closeConfirmModal, executeConfirm,
    exportData: storage.exportData, // Use directly from service
    handleFileUpload,
  };
});
