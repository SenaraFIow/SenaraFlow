
import fetch from "node-fetch"

export interface TokenLensProfile {
  tokenId: string
  name: string
  symbol: string
  holders: number
  marketCapUsd: number
  volume24hUsd: number
  liquidityScore: number
  riskScore: number
}

export interface TokenLensQueryParams {
  tokenId: string
  includeHistory?: boolean
}

const TOKEN_LENS_BASE = process.env.TOKEN_LENS_API_URL || 

export async function fetchTokenLensProfile(
  params: TokenLensQueryParams
): Promise<TokenLensProfile> {
  const url = new URL(`${TOKEN_LENS_BASE}/profile`)
  url.searchParams.set("tokenId", params.tokenId)
  if (params.includeHistory) url.searchParams.set("history", "true")

  const resp = await fetch(url.toString(), { headers: { "Accept": "application/json" } })
  if (!resp.ok) {
    throw new Error(`TokenLens API error: ${resp.status} ${resp.statusText}`)
  }

  const data = await resp.json()
  return {
    tokenId: data.id,
    name: data.name,
    symbol: data.symbol,
    holders: data.metrics.holders,
    marketCapUsd: data.metrics.marketCapUsd,
    volume24hUsd: data.metrics.volume24hUsd,
    liquidityScore: data.scores.liquidity,
    riskScore: data.scores.risk,
  }
}
