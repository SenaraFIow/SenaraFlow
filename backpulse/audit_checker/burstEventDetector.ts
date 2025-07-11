export interface BurstEvent {
  /** Position in the series where the burst occurred */
  index: number
  /** Value immediately before the burst */
  previous: number
  /** Value at the burst point */
  current: number
  /** current / previous */
  ratio: number
  /** Distance (in indices) from the last detected burst */
  intervalSinceLast: number
}

export interface DetectBurstsOptions {
  /** Ratio threshold for detecting a burst (e.g. 1.5 means 50% jump) */
  threshold: number
  /** Minimum number of indices between two bursts (default: 1) */
  minInterval?: number
  /** Maximum number of indices between two bursts (default: volumes.length) */
  maxInterval?: number
  /**
   * Whether to treat jumps from zero → positive as infinite bursts.
   * If false, skips cases where previous === 0 (default: true)
   */
  allowInfinite?: boolean
}

/**
 * Scan a time series for points where value jumps by at least `threshold`×
 * @param volumes Array of numeric samples (e.g. volume by time)
 * @param opts Detection settings
 * @throws RangeError on invalid thresholds or intervals
 */
export function detectBursts(
  volumes: number[],
  opts: DetectBurstsOptions
): BurstEvent[] {
  const { threshold, minInterval = 1, maxInterval = volumes.length, allowInfinite = true } = opts

  // --- Input validation ---
  if (!Array.isArray(volumes)) {
    throw new TypeError(`volumes must be an array, got ${typeof volumes}`)
  }
  if (threshold <= 1 || !Number.isFinite(threshold)) {
    throw new RangeError(`threshold must be > 1 and finite, got ${threshold}`)
  }
  if (!Number.isInteger(minInterval) || minInterval < 1) {
    throw new RangeError(`minInterval must be integer ≥1, got ${minInterval}`)
  }
  if (!Number.isInteger(maxInterval) || maxInterval < minInterval) {
    throw new RangeError(`maxInterval must be integer ≥ minInterval (${minInterval}), got ${maxInterval}`)
  }

  const events: BurstEvent[] = []
  let lastDetectedIndex = -Infinity

  for (let i = 1; i < volumes.length; i++) {
    const prev = volumes[i - 1]
    const curr = volumes[i]
    let ratio: number

    if (prev === 0) {
      if (!allowInfinite) continue
      ratio = Infinity
    } else {
      ratio = curr / prev
    }

    const sinceLast = i - lastDetectedIndex
    const qualifiesByRatio = ratio >= threshold
    const qualifiesByInterval = sinceLast >= minInterval && sinceLast <= maxInterval

    if (qualifiesByRatio && qualifiesByInterval) {
      events.push({ index: i, previous: prev, current: curr, ratio, intervalSinceLast: sinceLast })
      lastDetectedIndex = i
    }
  }

  return events
}
