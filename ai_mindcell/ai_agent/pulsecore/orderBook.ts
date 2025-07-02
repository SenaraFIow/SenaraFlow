import fetch from "node-fetch"

export interface Order {
  price: number
  size: number
}

export interface OrderBookData {
  bids: Order[]
  asks: Order[]
}

export class OrderBookManager {
  constructor(private apiUrl: string) {}

  private async get<T>(path: string): Promise<T> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(`${this.apiUrl}${path}`, {
        method: "GET",
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`Fetch error ${res.status}`)
      return (await res.json()) as T
    } finally {
      clearTimeout(id)
    }
  }

  async fetchOrderBook(symbol: string, depth: number = 50): Promise<OrderBookData> {
    return this.get<OrderBookData>(`/markets/${symbol}/orderbook?depth=${depth}`)
  }

  computeSpread(book: OrderBookData): number {
    const bestBid = book.bids[0]?.price ?? 0
    const bestAsk = book.asks[0]?.price ?? 0
    return bestAsk - bestBid
  }

  computeDepthSizes(book: OrderBookData): { bidDepth: number; askDepth: number } {
    const bidDepth = book.bids.reduce((sum, o) => sum + o.size, 0)
    const askDepth = book.asks.reduce((sum, o) => sum + o.size, 0)
    return { bidDepth, askDepth }
  }

  computeImbalance(book: OrderBookData): number {
    const { bidDepth, askDepth } = this.computeDepthSizes(book)
    const total = bidDepth + askDepth
    return total > 0 ? (bidDepth - askDepth) / total : 0
  }
}