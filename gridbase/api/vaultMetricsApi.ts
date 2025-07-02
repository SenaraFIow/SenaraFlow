
/**
 * Response shape for aggregate vault health metrics.
 */
export interface VaultHealthMetrics {
  averageHealthRatio: number
  worstHealthRatio: number
  bestHealthRatio: number
  totalCollateral: number
  totalDebt: number
}

/**
 * Fetch global metrics for all vaults.
 */
export async function fetchVaultHealthMetrics(): Promise<VaultHealthMetrics> {
  const res = await fetch(`/api/vaults/metrics/health`)
  if (!res.ok) throw new Error(`Failed to fetch vault health metrics: ${res.status}`)
  return res.json()
}
