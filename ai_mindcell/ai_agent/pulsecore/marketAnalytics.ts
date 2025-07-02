import fetch from "node-fetch"

interface TradeTick {
  timestamp: number
  price: number
  size: number
  side: "buy" | "sell"
}

export class MarketAnalytics {
  constructor(private apiUrl: string) {}

  private async get<T>(path: string): Promise<T> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(`${this.apiUrl}${path}`, {
        method: "GET",
        signal: controller.signal,
      })
      if (!res.ok) {
        throw new Error(`Fetch error ${res.status}: ${res.statusText}`)
      }
      return (await res.json()) as T
    } finally {
      clearTimeout(id)
    }
  }

  async fetchTradeHistory(symbol: string, limit = 100): Promise<TradeTick[]> {
    return this.get<TradeTick[]>(`/markets/${symbol}/trades?limit=${limit}`)
  }

  calculateVWAP(ticks: TradeTick[]): number {
    const { pvSum, volSum } = ticks.reduce(
      (acc, { price, size }) => ({
        pvSum: acc.pvSum + price * size,
        volSum: acc.volSum + size,
      }),
      { pvSum: 0, volSum: 0 }
    )
    return volSum > 0 ? pvSum / volSum : 0
  }

  simpleMovingAverage(ticks: TradeTick[], window = 20): number {
    const slice = ticks.slice(-window)
    const sum = slice.reduce((acc, { price }) => acc + price, 0)
    return slice.length ? sum / slice.length : 0
  }

  async detectArbitrage(marketA: string, marketB: string): Promise<number> {
    const [a, b] = await Promise.all([
      this.fetchTradeHistory(marketA, 60),
      this.fetchTradeHistory(marketB, 60),
    ])
    const delta = this.calculateVWAP(a) - this.calculateVWAP(b)
    return parseFloat(delta.toFixed(6))
  }
}