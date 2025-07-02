/**
 * Evaluate a simple risk score for a token based on price change, liquidity, and flags.
 */
export function calculateRiskScore(
  priceChangePct: number,   // e.g. +5 = +5%
  liquidity: number,        // total token liquidity in USD
  flags: number             // bitmask of risk flags
): number {
  // Base score from price volatility
  const volScore = Math.min(Math.abs(priceChangePct) / 10, 1) * 50

  // Liquidity factor: more liquidity reduces risk
  const liqScore = liquidity > 0
    ? Math.max(0, 30 - Math.log10(liquidity) * 5)
    : 30

  // Flags add fixed penalty per bit
  const flagCount = flags.toString(2).split("1").length - 1
  const flagScore = flagCount * 5

  const raw = volScore + liqScore + flagScore
  // normalize to 0–100
  return Math.min(Math.round(raw), 100)
}