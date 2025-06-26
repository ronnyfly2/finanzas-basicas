export const formatCurrency = (value, includeSymbol = true, currency = 'PEN', locale = 'es-PE') => {
  const amount = Number(value) || 0;
  const options = { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 };
  if (!includeSymbol) {
    delete options.style;
    delete options.currency;
  }
  return new Intl.NumberFormat(locale, options).format(amount);
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
