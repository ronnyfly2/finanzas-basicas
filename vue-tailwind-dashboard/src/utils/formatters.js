/**
 * Formats a numerical amount into a currency string, converting it to the target display currency.
 *
 * @param {number} originalAmount - The amount in its original transaction currency.
 * @param {string} transactionCurrencyCode - The currency code of the original transaction (e.g., 'USD', 'PEN').
 * @param {string} targetDisplayCurrencyCode - The currency code to display the amount in (e.g., store.selectedCurrencyCode).
 * @param {Array<Object>} activeCurrencies - Array of available currency objects from mainStore.
 *                                          Each object: { code, symbol, name, exchangeRate (vs USD) }.
 * @param {Object} exchangeRates - Object from mainStore with currency codes as keys and their rates against USD.
 * @returns {string} The formatted currency string (e.g., "$1,234.56", "S/ 500.00").
 */
export const formatCurrency = (originalAmount, transactionCurrencyCode, targetDisplayCurrencyCode, activeCurrencies, exchangeRates) => {
  let amountToDisplay = Number(originalAmount) || 0;

  // Ensure activeCurrencies and exchangeRates are valid and usable
  if (!activeCurrencies || activeCurrencies.length === 0 || !exchangeRates || Object.keys(exchangeRates).length === 0) {
    console.warn('formatCurrency: activeCurrencies or exchangeRates are not available. Displaying raw amount.');
    // Fallback: display original amount with its code, or just the number if code is unknown
    return `${transactionCurrencyCode || ''} ${amountToDisplay.toFixed(2)}`;
  }

  const targetCurrencyDetails = activeCurrencies.find(c => c.code === targetDisplayCurrencyCode) ||
                                activeCurrencies.find(c => c.code === 'USD') ||
                                activeCurrencies[0];

  if (!targetCurrencyDetails) {
    console.warn(`formatCurrency: Target currency details not found for ${targetDisplayCurrencyCode}. Displaying raw amount.`);
    return `${targetDisplayCurrencyCode || ''} ${amountToDisplay.toFixed(2)}`;
  }

  const effectiveTargetDisplayCurrencyCode = targetCurrencyDetails.code;

  // Perform conversion if the transaction currency is different from the target display currency
  if (transactionCurrencyCode !== effectiveTargetDisplayCurrencyCode) {
    const transactionRateVsUSD = exchangeRates[transactionCurrencyCode];
    const targetRateVsUSD = exchangeRates[effectiveTargetDisplayCurrencyCode];

    if (typeof transactionRateVsUSD !== 'number' || transactionRateVsUSD <= 0 ||
        typeof targetRateVsUSD !== 'number' || targetRateVsUSD <= 0) {
      console.warn(`Exchange rate missing or invalid for conversion: ${transactionCurrencyCode} (rate: ${transactionRateVsUSD}) -> ${effectiveTargetDisplayCurrencyCode} (rate: ${targetRateVsUSD})`);

      const originalCurrencyDetails = activeCurrencies.find(c => c.code === transactionCurrencyCode);
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: transactionCurrencyCode,
          currencyDisplay: 'symbol'
        }).format(amountToDisplay);
      } catch (e) {
        return `${originalCurrencyDetails?.symbol || transactionCurrencyCode} ${amountToDisplay.toFixed(2)}`;
      }
    }

    // Convert originalAmount to USD first, then from USD to target currency
    const amountInUSD = originalAmount / transactionRateVsUSD;
    amountToDisplay = amountInUSD * targetRateVsUSD;
  }

  try {
    // Use Intl.NumberFormat for locale-specific formatting.
    // The 'currency' option should be the targetDisplayCurrencyCode for correct symbol and formatting.
    return new Intl.NumberFormat(undefined, { // Uses browser's default locale
      style: 'currency',
      currency: targetDisplayCurrencyCode, // Ensures correct currency symbol and formatting for the target currency
      currencyDisplay: 'symbol', // Prefer symbol (e.g., $) over code (e.g., USD)
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountToDisplay);
  } catch (error) {
    // Fallback for environments where Intl or specific currency code might not be supported
    // console.warn(`Error formatting currency ${targetDisplayCurrencyCode} with Intl:`, error);
    // Use the symbol from our activeCurrencies data as a fallback.
    return `${targetCurrencyDetails.symbol || targetDisplayCurrencyCode} ${amountToDisplay.toFixed(2)}`;
  }
};


export const formatDateHeader = (dateString) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Ensure dateString is treated as UTC to avoid timezone shifts from new Date()
  // Handles cases where dateString might already be a Date object or a string
  let transactionDate;
  if (dateString instanceof Date) {
    transactionDate = new Date(Date.UTC(dateString.getUTCFullYear(), dateString.getUTCMonth(), dateString.getUTCDate()));
  } else {
    const parts = String(dateString).split('-'); // YYYY-MM-DD
    transactionDate = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  }

  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const yesterdayUTC = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));

  if (transactionDate.getTime() === todayUTC.getTime()) return 'Hoy';
  if (transactionDate.getTime() === yesterdayUTC.getTime()) return 'Ayer';

  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(transactionDate);
};

// Could add getCategoryBgColor here too if it's used in multiple places without store access
// export const getCategoryStyle = (hexColor, opacity = 1) => { ... }


export const getCategoryStyle = (hexColor, opacity = 1) => {
  if (!hexColor) { // Default color if none provided
    hexColor = '#94a3b8'; // slate-400 or similar
  }
  let r = 0, g = 0, b = 0;
  if (hexColor.length === 7) { // #RRGGBB
    r = parseInt(hexColor.substring(1, 3), 16);
    g = parseInt(hexColor.substring(3, 5), 16);
    b = parseInt(hexColor.substring(5, 7), 16);
  } else if (hexColor.length === 4) { // #RGB
    r = parseInt(hexColor.substring(1, 2) + hexColor.substring(1, 2), 16);
    g = parseInt(hexColor.substring(2, 3) + hexColor.substring(2, 3), 16);
    b = parseInt(hexColor.substring(3, 4) + hexColor.substring(3, 4), 16);
  } else { // Fallback for invalid hex
    hexColor = '#94a3b8';
    r = parseInt(hexColor.substring(1, 3), 16);
    g = parseInt(hexColor.substring(3, 5), 16);
    b = parseInt(hexColor.substring(5, 7), 16);
  }

  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF'; // Determine if black or white text is more readable

  return {
    backgroundColor: `rgba(${r},${g},${b},${opacity})`,
    color: textColor, // Return text color for better contrast if needed directly
    borderColor: `rgb(${r},${g},${b})` // Full opacity border
  };
};
