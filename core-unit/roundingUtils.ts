/**
 * Safely ensures a value is a non-negative integer.
 * @param places Number of decimal places
 */
function normalizePlaces(places: number): number {
  if (!Number.isInteger(places) || places < 0) {
    throw new RangeError(`Decimal places must be a non-negative integer, got ${places}`)
  }
  return places
}

/**
 * Round a finite number to a given number of decimal places.
 * @param value The number to round.
 * @param places Number of decimal places (default 2).
 * @returns NaN/infinity values pass through unchanged.
 */
export function roundTo(value: number, places = 2): number {
  const p = normalizePlaces(places)
  if (!Number.isFinite(value)) return value
  const factor = 10 ** p
  // add a tiny epsilon to mitigate floating errors
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Truncate a finite number to a fixed number of decimal places without rounding.
 * @param value The number to truncate.
 * @param places Number of decimal places (default 2).
 * @returns NaN/infinity values pass through unchanged.
 */
export function truncateTo(value: number, places = 2): number {
  const p = normalizePlaces(places)
  if (!Number.isFinite(value)) return value
  const factor = 10 ** p
  return Math.trunc(value * factor) / factor
}

/**
 * Format a number with thousands separators and fixed decimals.
 * Uses Intl.NumberFormat under the hood.
 * @param value The number to format.
 * @param places Decimal places (default 2).
 * @param locale BCP-47 locale string or array of locale strings (default: user-locale).
 * @param options Additional Intl.NumberFormatOptions (e.g. { useGrouping: false }).
 * @returns A localized string, or the raw value string for NaN/infinity.
 */
export function formatNumber(
  value: number,
  places = 2,
  locale?: string | string[],
  options: Intl.NumberFormatOptions = {}
): string {
  const p = normalizePlaces(places)
  if (!Number.isFinite(value)) return String(value)
  const rounded = roundTo(value, p)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: p,
    maximumFractionDigits: p,
    ...options
  }).format(rounded)
}
