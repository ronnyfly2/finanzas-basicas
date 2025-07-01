const TRANSACTIONS_KEY = 'family-transactions';
const MEMBERS_KEY = 'family-members';
const CATEGORIES_KEY = 'family-categories';
const ACTIVE_CURRENCIES_KEY = 'active-currencies';
const EXCHANGE_RATES_KEY = 'exchange-rates';

// Generic helper functions (private to this module)
const loadData = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

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

// Currency Settings
const defaultCurrencies = [
  { code: 'PEN', name: 'Soles Peruanos', symbol: 'S/', exchangeRate: 3.75 },
  { code: 'USD', name: 'Dólares Americanos', symbol: '$', exchangeRate: 1.00 },
];

const defaultExchangeRates = {
  PEN: 3.75,
  USD: 1.00,
};

/**
 * Loads the list of active currencies from localStorage.
 * If no data is found, returns a default list of currencies (PEN and USD).
 * @returns {Array<Object>} An array of active currency objects, each with code, name, symbol, and exchangeRate.
 */
export const loadActiveCurrencies = () => {
  return loadData(ACTIVE_CURRENCIES_KEY, defaultCurrencies);
};

/**
 * Saves the list of active currencies to localStorage.
 * @param {Array<Object>} currencies - The array of active currency objects to save.
 */
export const saveActiveCurrencies = (currencies) => {
  saveData(ACTIVE_CURRENCIES_KEY, currencies);
};

/**
 * Loads the exchange rates object from localStorage.
 * If no data is found, returns a default set of exchange rates (PEN and USD against USD).
 * @returns {Object.<string, number>} An object where keys are currency codes and values are their exchange rates relative to a base currency (e.g., USD).
 */
export const loadExchangeRates = () => {
  return loadData(EXCHANGE_RATES_KEY, defaultExchangeRates);
};

/**
 * Saves the exchange rates object to localStorage.
 * @param {Object.<string, number>} rates - The exchange rates object to save.
 */
export const saveExchangeRates = (rates) => {
  saveData(EXCHANGE_RATES_KEY, rates);
};

// --- Currency CRUD ---
export const addCurrency = (currency) => {
  const currencies = loadActiveCurrencies();
  const rates = loadExchangeRates();

  if (currencies.find(c => c.code === currency.code)) {
    // Handle error: currency code already exists
    console.error("Error: Currency code already exists.");
    return false;
  }
  currencies.push(currency);
  rates[currency.code] = currency.exchangeRate;

  saveActiveCurrencies(currencies);
  saveExchangeRates(rates);
  return true;
};

export const updateCurrency = (updatedCurrency) => {
  const currencies = loadActiveCurrencies();
  const rates = loadExchangeRates();

  const index = currencies.findIndex(c => c.code === updatedCurrency.code);
  if (index === -1) {
    // Handle error: currency not found
    console.error("Error: Currency not found for update.");
    return false;
  }
  currencies[index] = updatedCurrency;
  rates[updatedCurrency.code] = updatedCurrency.exchangeRate;

  saveActiveCurrencies(currencies);
  saveExchangeRates(rates);
  return true;
};

export const deleteCurrency = (currencyCode) => {
  let currencies = loadActiveCurrencies();
  const rates = loadExchangeRates();
  const transactions = loadTransactions(); // Check if currency is in use

  // Basic check: Cannot delete USD (base currency for rates) or if it's the only currency
  if (currencyCode === 'USD') {
    alert("Cannot delete the base currency (USD).");
    return false;
  }
  if (currencies.length <= 1) {
    alert("Cannot delete the only available currency.");
    return false;
  }

  // Check if the currency is used in any transaction
  if (transactions.some(t => t.currency === currencyCode)) {
    alert(`Cannot delete currency ${currencyCode} as it is used in existing transactions.`);
    return false;
  }

  currencies = currencies.filter(c => c.code !== currencyCode);
  delete rates[currencyCode];

  saveActiveCurrencies(currencies);
  saveExchangeRates(rates);
  return true;
};

// --- Selected Currency Preference ---
const SELECTED_CURRENCY_KEY = 'selected-currency-code';

export const loadSelectedCurrencyCode = () => {
  const code = localStorage.getItem(SELECTED_CURRENCY_KEY);
  // Return 'PEN' if nothing is stored, or if stored value is not in active currencies.
  // However, a more robust check against activeCurrencies might be better done in the store
  // after loading both activeCurrencies and this preference.
  return code ? JSON.parse(code) : 'PEN'; // Default to PEN
};

export const saveSelectedCurrencyCode = (currencyCode) => {
  localStorage.setItem(SELECTED_CURRENCY_KEY, JSON.stringify(currencyCode));
};


// handleFileUpload logic will likely be part of a component that uses this service or a store action
// For now, the core load/save operations are here.
