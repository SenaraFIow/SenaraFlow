import type { SolActivityRecord } from "./solanaTokenActivityAnalyzer"

export interface PatternMatch {
  index: number
  windowSize: number
  pattern: string
}

/**
 * Detects simple volume-based patterns in chronological activity.
 */
export function detectTransferPatterns(
  records: SolActivityRecord[],
  windowSize: number,
  threshold: number
): PatternMatch[] {
  const volumes = records.map(r => r.amount)
  const matches: PatternMatch[] = []
  for (let i = 0; i + windowSize < volumes.length; i++) {
    const window = volumes.slice(i, i + windowSize)
    const avg = window.reduce((a, b) => a + b, 0) / windowSize
    if (avg >= threshold) {
      matches.push({
        index: i,
        windowSize,
        pattern: `high-volume window starting at ${records[i].signature}`,
      })
    }
  }
  return matches
}
