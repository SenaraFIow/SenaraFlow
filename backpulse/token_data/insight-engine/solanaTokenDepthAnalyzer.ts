
import { Connection, PublicKey } from "@solana/web3.js"

export interface TokenDepthPoint {
  price: number
  size: number
}

export interface DepthAnalysis {
  averageBidDepth: number
  averageAskDepth: number
  spread: number
}

export class SolanaTokenDepthAnalyzer {
  constructor(private endpoint: string, private marketPubkey: string) {}

  private getConnection() {
    return new Connection(this.endpoint)
  }

  /**
   * Fetch the orderbook (bids and asks) from on-chain DEX program.
   * (Example assumes Serum DEX.)
   */
  async fetchOrderbook(): Promise<{ bids: TokenDepthPoint[]; asks: TokenDepthPoint[] }> {
    const conn = this.getConnection()
    const market = await conn.getAccountInfo(new PublicKey(this.marketPubkey))
    // parse Serum data structure... placeholder
    // In real code, use @project-serum/serum Market.load(...)
    return { bids: [], asks: [] }
  }

  /**
   * Analyze depth: average sizes and spread.
   */
  async analyzeDepth(): Promise<DepthAnalysis> {
    const { bids, asks } = await this.fetchOrderbook()
    const avg = (arr: TokenDepthPoint[]) =>
      arr.reduce((sum, p) => sum + p.size, 0) / Math.max(arr.length, 1)
    const bestBid = bids[0]?.price || 0
    const bestAsk = asks[0]?.price || 0
    return {
      averageBidDepth: avg(bids),
      averageAskDepth: avg(asks),
      spread: bestAsk - bestBid,
    }
  }
}
