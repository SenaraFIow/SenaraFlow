
/**
 * Round a number to a given number of decimal places.
 * @param value The number to round.
 * @param places Number of decimal places (default 2).
 */
export function roundTo(value: number, places = 2): number {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

/**
 * Truncate a number to a fixed number of decimal places without rounding.
 * @param value The number to truncate.
 * @param places Number of decimal places (default 2).
 */
export function truncateTo(value: number, places = 2): number {
  const factor = 10 ** places
  return Math.trunc(value * factor) / factor
}

/**
 * Format a number with thousands separators and fixed decimals.
 * @param value The number to format.
 * @param places Decimal places (default 2).
 */
export function formatNumber(value: number, places = 2): string {
  return roundTo(value, places)
    .toLocaleString(undefined, { minimumFractionDigits: places, maximumFractionDigits: places })
}
