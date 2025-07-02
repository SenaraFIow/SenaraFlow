
/**
 * Core data types for BackPulse events
 */
export interface RawPulseEvent {
  timestamp: number | string
  eventType: string
  payload: any
}

export interface TransactionPulse {
  type: "transaction"
  timestamp: number
  txHash: string
  amount: number
  token: string
}

export interface SentimentPulse {
  type: "sentiment"
  timestamp: number
  symbol: string
  score: number  // -1 to +1
}

export interface AnomalyPulse {
  type: "anomaly"
  timestamp: number
  description: string
  severity: "low" | "medium" | "high"
}

export type BackPulseEvent = TransactionPulse | SentimentPulse | AnomalyPulse