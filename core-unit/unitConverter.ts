
/**
 * Convert a raw token amount (big integer or string) into a human-readable decimal.
 * @param rawAmount Big integer or string representation of token amount (in smallest unit).
 * @param decimals Number of decimals for the token (e.g. 18 for ERC-20).
 */
export function convertDecimals(
  rawAmount: string | number,
  decimals: number
): number {
  const amt = typeof rawAmount === "string" ? BigInt(rawAmount) : BigInt(Math.floor(rawAmount))
  const divisor = 10n ** BigInt(decimals)
  const integerPart = amt / divisor
  const fractionalPart = amt % divisor
  const fraction = Number(fractionalPart) / Number(divisor)
  return Number(integerPart) + fraction
}

/**
 * Convert a human‐readable decimal amount back to raw smallest‐unit integer string.
 * @param amount Decimal amount.
 * @param decimals Number of decimals.
 */
export function toRawUnits(amount: number, decimals: number): string {
  const factor = 10 ** decimals
  const raw = BigInt(Math.round(amount * factor))
  return raw.toString()
}
