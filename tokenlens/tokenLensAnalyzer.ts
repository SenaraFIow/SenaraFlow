
import type { TokenLensProfile } from "./tokenLensApi"

export interface LensInsights {
  supplyConcentration: number    // e.g. % held by top 10 addresses
  holderDistributionEntropy: number
  momentumScore: number
  healthIndicator: "Good" | "Fair" | "Poor"
}

export function analyzeTokenLensProfile(
  profile: TokenLensProfile
): LensInsights {
  // Supply concentration: high risk if few holders
  const concentration = Math.min(profile.holders > 0 ? 10000 / profile.holders : 100, 100)
  
  // Entropy proxy: lower holders => lower entropy
  const entropy = Math.round((Math.log(profile.holders + 1) / Math.log(10000)) * 10000) / 10000
  
  // Momentum: ratio of 24h volume to market cap
  const momentum = profile.marketCapUsd > 0
    ? Math.round((profile.volume24hUsd / profile.marketCapUsd) * 10000) / 10000
    : 0

  // Health: combine riskScore and liquidityScore
  const healthMetric = profile.liquidityScore - profile.riskScore
  const health: LensInsights["healthIndicator"] =
    healthMetric > 50 ? "Good" :
    healthMetric > 20 ? "Fair" :
    "Poor"

  return {
    supplyConcentration: Math.round(concentration * 100) / 100,
    holderDistributionEntropy: entropy,
    momentumScore: momentum,
    healthIndicator: health,
  }
}
