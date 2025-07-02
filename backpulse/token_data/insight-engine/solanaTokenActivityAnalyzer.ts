
import { Connection, PublicKey } from "@solana/web3.js"

export interface SolActivityRecord {
  slot: number
  signature: string
  amount: number
  source: string
  destination: string
}

export class SolanaTokenActivityAnalyzer {
  constructor(private endpoint: string, private mint: string) {}

  private getConnection() {
    return new Connection(this.endpoint)
  }


  async fetchRecentSignatures(limit = 100): Promise<string[]> {
    const conn = this.getConnection()
    const mintPubkey = new PublicKey(this.mint)
    const largestAccounts = await conn.getTokenLargestAccounts(mintPubkey)
    const accounts = largestAccounts.value.map(a => a.address)
    // flatten signatures 
    const sigs = await Promise.all(
      accounts.map(a => conn.getSignaturesForAddress(a, { limit }))
    )
    return sigs.flat().map(s => s.signature)
  }


  async analyzeActivity(limit = 50): Promise<SolActivityRecord[]> {
    const conn = this.getConnection()
    const sigs = await this.fetchRecentSignatures(limit)
    const records: SolActivityRecord[] = []
    for (const sig of sigs) {
      const tx = await conn.getTransaction(sig, { commitment: "confirmed" })
      if (!tx?.meta?.postTokenBalances || !tx.meta.preTokenBalances) continue
      tx.meta.postTokenBalances.forEach((post, idx) => {
        const pre = tx.meta.preTokenBalances![idx]
        const delta = (post.uiTokenAmount.uiAmount || 0) - (pre.uiTokenAmount.uiAmount || 0)
        if (delta !== 0) {
          records.push({
            slot: tx.slot,
            signature: sig,
            amount: Math.abs(delta),
            source: pre.owner || "unknown",
            destination: post.owner || "unknown",
          })
        }
      })
    }
    return records
  }
}
