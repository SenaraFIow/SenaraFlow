
import { v4 as uuidv4 } from "uuid"

// --- Types ---
export interface TransferRecord {
  token: string
  from: string
  to: string
  amount: number
  timestamp: number
}

export interface ActivityRecord {
  address: string
  transfersIn: number
  transfersOut: number
  volumeIn: number
  volumeOut: number
  lastTimestamp: number
}

export interface TokenGroupSummary {
  token: string
  totalTransferred: number
  uniqueSenders: number
  uniqueReceivers: number
}

export interface SuspiciousAddress {
  address: string
  score: number
  reasons: string[]
}

export interface AnalyticsOptions {
  transferThreshold: number
  volumeThreshold: number
  suspicionWindowMs: number
}

export interface TokenAnalyticsReport {
  groupSummary: TokenGroupSummary[]
  suspicious: SuspiciousAddress[]
}

// --- Core Logic ---

/**
 * Groups transfer records by token.
 */
export function groupByToken(records: TransferRecord[]): TokenGroupSummary[] {
  const map: Record<string, { transferred: number; senders: Set<string>; receivers: Set<string> }> = {}
  records.forEach(r => {
    if (!map[r.token]) {
      map[r.token] = { transferred: 0, senders: new Set(), receivers: new Set() }
    }
    map[r.token].transferred += r.amount
    map[r.token].senders.add(r.from)
    map[r.token].receivers.add(r.to)
  })
  return Object.entries(map).map(([token, data]) => ({
    token,
    totalTransferred: data.transferred,
    uniqueSenders: data.senders.size,
    uniqueReceivers: data.receivers.size,
  }))
}

/**
 * Detects suspicious activity based on thresholds.
 */
export function detectSuspiciousActivity(
  records: ActivityRecord[],
  transferThreshold: number,
  volumeThreshold: number,
  timeWindowMs: number
): SuspiciousAddress[] {
  const now = Date.now()
  return records
    .map(r => {
      let score = 0
      const reasons: string[] = []
      if (r.transfersIn + r.transfersOut > transferThreshold) {
        score++; reasons.push("high transfer count")
      }
      if (r.volumeIn + r.volumeOut > volumeThreshold) {
        score++; reasons.push("high volume")
      }
      if (now - r.lastTimestamp < timeWindowMs) {
        score++; reasons.push("recent activity")
      }
      return score > 0 ? { address: r.address, score, reasons } : null
    })
    .filter((x): x is SuspiciousAddress => x !== null)
    .sort((a, b) => b.score - a.score)
}

/**
 * Combines grouping and suspicious detection into a full report.
 */
export function analyzeTokens(
  transfers: TransferRecord[],
  activity: ActivityRecord[],
  options: AnalyticsOptions
): TokenAnalyticsReport {
  const groupSummary = groupByToken(transfers)
  const suspicious = detectSuspiciousActivity(
    activity,
    options.transferThreshold,
    options.volumeThreshold,
    options.suspicionWindowMs
  )
  return { groupSummary, suspicious }
}

/**
 * High-level helper that simulates asynchronous enrichment.
 */
export async function useTokenAnalytics(
  transfers: TransferRecord[],
  activity: ActivityRecord[],
  options: AnalyticsOptions
): Promise<TokenAnalyticsReport> {
  // Example: could fetch additional data here...
  await Promise.resolve()
  return analyzeTokens(transfers, activity, options)
}
