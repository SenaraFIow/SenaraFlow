import type { TokenLensProfile } from "./tokenLensApi"

export interface LensInsights {
  supplyConcentration: number    // % of total supply potentially held by few
  holderDistributionEntropy: number // proxy for decentralization
  momentumScore: number          // short-term market activity indicator
  healthIndicator: "Good" | "Fair" | "Poor" // summary status
}

/**
 * Performs a layered analysis of a token profile using concentration,
 * distribution, volume dynamics, and risk/liquidity balance.
 */
export function analyzeTokenLensProfile(
  profile: TokenLensProfile
): LensInsights {
  // --- 1. Supply Concentration ---
  // Risky if top holders dominate. Simple inverse of holder count.
  const rawConcentration = profile.holders > 0
    ? 10000 / profile.holders
    : 100
  const supplyConcentration = Math.min(Math.round(rawConcentration * 100) / 100, 100)

  // --- 2. Holder Distribution Entropy ---
  // Proxy entropy: scales logarithmically with holder count
  const maxHoldersRef = 10000
  const entropyBase = Math.log(profile.holders + 1) / Math.log(maxHoldersRef)
  const holderDistributionEntropy = Math.round(entropyBase * 10000) / 10000

  // --- 3. Momentum Score ---
  // Measures recent trading activity relative to size
  const volume = profile.volume24hUsd
  const marketCap = profile.marketCapUsd
  const momentumScore = marketCap > 0
    ? Math.round((volume / marketCap) * 10000) / 10000
    : 0

  // --- 4. Health Indicator ---
  // Combines liquidity vs risk — favors tokens with low risk and high access
  const risk = profile.riskScore
  const liquidity = profile.liquidityScore
  const healthMetric = liquidity - risk

  let healthIndicator: LensInsights["healthIndicator"]
  if (healthMetric >= 60) {
    healthIndicator = "Good"
  } else if (healthMetric >= 25) {
    healthIndicator = "Fair"
  } else {
    healthIndicator = "Poor"
  }

  return {
    supplyConcentration,
    holderDistributionEntropy,
    momentumScore,
    healthIndicator,
  }
}
