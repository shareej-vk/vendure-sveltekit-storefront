/**
 * Format a price as currency
 * @param price - The price to format (in cents)
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted price string
 */
export function formatCurrency(price: number, currency: string = 'USD'): string {
  const amount = price / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted price range
 */
export function formatPriceRange(min: number, max: number, currency: string = 'USD'): string {
  if (min === max) {
    return formatCurrency(min, currency);
  }
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}
