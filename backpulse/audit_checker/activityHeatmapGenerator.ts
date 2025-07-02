export interface ActivityPoint {
  timestamp: number
  count: number
}

export interface HeatmapConfig {
  buckets: number      // number of time buckets
  normalize: boolean   // scale counts 0–1
}

export function generateHeatmap(
  data: ActivityPoint[],
  config: HeatmapConfig
): number[] {
  if (data.length === 0) return []

  // find time range
  const times = data.map(d => d.timestamp)
  const minT = Math.min(...times)
  const maxT = Math.max(...times)
  const span = maxT - minT
  const bucketSize = span / config.buckets

  // initialize
  const buckets = Array(config.buckets).fill(0)
  for (const d of data) {
    const idx = Math.min(
      config.buckets - 1,
      Math.floor((d.timestamp - minT) / bucketSize)
    )
    buckets[idx] += d.count
  }

  if (config.normalize) {
    const maxCount = Math.max(...buckets, 1)
    return buckets.map(c => c / maxCount)
  }
  return buckets
}