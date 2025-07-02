
export interface BurstEvent {
  index: number
  previous: number
  current: number
  ratio: number
}

/**
 * Detect sudden volume bursts in a numeric series.
 */
export function detectBursts(
  volumes: number[],
  threshold: number,      // e.g. 1.5 for 50% increase
  minInterval = 1,
  maxInterval = volumes.length
): BurstEvent[] {
  const events: BurstEvent[] = []
  let lastIndex = -Infinity

  for (let i = 1; i < volumes.length; i++) {
    const prev = volumes[i - 1]
    const curr = volumes[i]
    const ratio = prev > 0 ? curr / prev : Infinity

    if (ratio >= threshold && i - lastIndex >= minInterval && i - lastIndex <= maxInterval) {
      events.push({ index: i, previous: prev, current: curr, ratio })
      lastIndex = i
    }
  }
  return events
}