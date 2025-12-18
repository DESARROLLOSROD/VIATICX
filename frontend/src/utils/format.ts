/**
 * Format a number as Mexican Peso currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

/**
 * Format a date to Spanish locale
 * @param date - Date string or Date object
 * @param format - Format type: 'short' | 'long' | 'medium'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'medium' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: 'short', year: 'numeric' },
    medium: { day: '2-digit', month: 'long', year: 'numeric' },
    long: {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    },
  };

  return new Intl.DateTimeFormat('es-MX', options[format]).format(dateObj);
}

/**
 * Parse currency string to number
 * @param currencyStr - Currency string (e.g., "$1,234.56")
 * @returns Numeric value
 */
export function parseCurrency(currencyStr: string): number {
  return parseFloat(currencyStr.replace(/[^0-9.-]+/g, ''));
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
