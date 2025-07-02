
export interface VaultInfo {
  id: string
  owner: string
  collateral: number
  debt: number
  healthRatio: number
  lastUpdated: number
}

export interface VaultGridConfig {
  refreshIntervalMs: number
  pageSize: number
  sortBy?: keyof VaultInfo
  sortDesc?: boolean
}

export class VaultGridModel {
  private vaults: VaultInfo[] = []
  private config: VaultGridConfig

  constructor(initial: VaultInfo[] = [], config?: Partial<VaultGridConfig>) {
    this.vaults = initial
    this.config = {
      refreshIntervalMs: 30000,
      pageSize: 20,
      sortBy: "healthRatio",
      sortDesc: true,
      ...config,
    }
  }

  public setVaults(vaults: VaultInfo[]): void {
    this.vaults = vaults
  }

  public getPage(page: number): VaultInfo[] {
    const sorted = this.getSorted()
    const start = (page - 1) * this.config.pageSize
    return sorted.slice(start, start + this.config.pageSize)
  }

  public getSorted(): VaultInfo[] {
    const { sortBy, sortDesc } = this.config
    if (!sortBy) return [...this.vaults]
    return [...this.vaults].sort((a, b) => {
      const diff = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0
      return sortDesc ? -diff : diff
    })
  }

  public updateConfig(update: Partial<VaultGridConfig>): void {
    this.config = { ...this.config, ...update }
  }

  public findVault(id: string): VaultInfo | undefined {
    return this.vaults.find(v => v.id === id)
  }
}
