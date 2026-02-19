// Formats a date using Spanish locale and optional Intl overrides.
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
};

// Formats a numeric amount as currency using Spanish locale settings.
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Formats numbers with a fixed decimal precision.
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Formats a value as a percentage string.
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  return `${formatNumber(value, decimals)}%`;
};

// Returns a human-readable relative time string for a given date.
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return formatDate(date);
};
