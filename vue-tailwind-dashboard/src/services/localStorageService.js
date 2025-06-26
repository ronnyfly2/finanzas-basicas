const TRANSACTIONS_KEY = 'family-transactions';
const MEMBERS_KEY = 'family-members';
const CATEGORIES_KEY = 'family-categories';

export const loadTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const loadMembers = () => {
  const data = localStorage.getItem(MEMBERS_KEY);
  return data ? JSON.parse(data) : ['Padre', 'Madre', 'Hijo', 'Hija', 'Familia']; // Default if not found
};

export const saveMembers = (members) => {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

export const loadCategories = () => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  // Default categories if not found
  const defaultCategories = [
    { name: 'Comida', color: '#4ade80' }, { name: 'Transporte', color: '#60a5fa' },
    { name: 'Vivienda', color: '#facc15' }, { name: 'Ocio', color: '#fb923c' },
    { name: 'Salud', color: '#f87171' }, { name: 'Educación', color: '#c084fc' },
    { name: 'Ropa', color: '#ec4899' }, { name: 'Otros', color: '#94a3b8' }
  ];
  return data ? JSON.parse(data) : defaultCategories;
};

export const saveCategories = (categories) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const exportData = () => {
  const dataToExport = {
    transactions: loadTransactions(),
    members: loadMembers(),
    categories: loadCategories(),
  };
  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard-gastos-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// handleFileUpload logic will likely be part of a component that uses this service or a store action
// For now, the core load/save operations are here.
