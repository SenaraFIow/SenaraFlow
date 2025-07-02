
import type { VaultInfo } from "../vaults/vaultGridModel"

/**
 * Fetch a paginated list of vaults from the backend.
 * @param page 1-based page number
 * @param pageSize number of items per page
 */
export async function fetchVaults(
  page: number,
  pageSize: number
): Promise<{ vaults: VaultInfo[]; total: number }> {
  const res = await fetch(`/api/vaults?page=${page}&pageSize=${pageSize}`)
  if (!res.ok) throw new Error(`Failed to fetch vaults: ${res.status}`)
  return res.json()
}

/**
 * Fetch detailed information for a single vault.
 * @param id vault identifier
 */
export async function fetchVaultDetails(id: string): Promise<VaultInfo> {
  const res = await fetch(`/api/vaults/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`Failed to fetch vault ${id}: ${res.status}`)
  return res.json()
}