import type { BackPulseEvent } from "../typecast/pulseTypes"
import { castPulse } from "../typecast/typeCaster"

export interface PulseTaskPayload {
  rawEvents: unknown[]
}

export interface PulseTaskResult {
  events: BackPulseEvent[]
  invalidCount: number
  processedAt: number
  durationMs: number
}

export class PulseTaskNode {
  public readonly id: string
  public readonly payload: PulseTaskPayload

  constructor(id: string, payload: PulseTaskPayload) {
    this.id = id
    this.payload = payload
  }

  /**
   * Validate and cast raw events into typed BackPulseEvent[]
   * Returns result with valid events, invalid count, timestamp, and duration
   */
  public process(): PulseTaskResult {
    const start = Date.now()
    const events: BackPulseEvent[] = []
    let invalidCount = 0

    for (const [index, raw] of this.payload.rawEvents.entries()) {
      try {
        const evt = castPulse(raw as any)
        events.push(evt)
      } catch (error) {
        console.warn(
          `[PulseTaskNode:${this.id}] Skipped invalid event at index ${index}:`,
          error
        )
        invalidCount++
      }
    }

    const end = Date.now()
    const durationMs = end - start

    console.info(
      `[PulseTaskNode:${this.id}] Processed ${events.length} valid events, ${invalidCount} invalid in ${durationMs}ms`
    )

    return {
      events,
      invalidCount,
      processedAt: end,
      durationMs,
    }
  }

  /**
   * Asynchronous version of process for large payloads
   */
  public async processAsync(concurrency = 5): Promise<PulseTaskResult> {
    const start = performance.now()
    const events: BackPulseEvent[] = []
    let invalidCount = 0

    const tasks = this.payload.rawEvents.map((raw, index) => async () => {
      try {
        const evt = castPulse(raw as any)
        events.push(evt)
      } catch (error) {
        console.warn(
          `[PulseTaskNode:${this.id}] Async skipped invalid event at index ${index}:`,
          error
        )
        invalidCount++
      }
    })

    // run tasks in limited concurrency batches
    for (let i = 0; i < tasks.length; i += concurrency) {
      const batch = tasks.slice(i, i + concurrency).map(fn => fn())
      await Promise.all(batch)
    }

    const end = performance.now()
    const durationMs = Math.round(end - start)

    console.info(
      `[PulseTaskNode:${this.id}] Async processed ${events.length} valid events, ${invalidCount} invalid in ${durationMs}ms`
    )

    return {
      events,
      invalidCount,
      processedAt: Date.now(),
      durationMs,
    }
  }

  /**
   * Static helper to run processing without instantiation
   */
  public static run(
    id: string,
    rawEvents: unknown[],
    asyncMode = false
  ): Promise<PulseTaskResult> | PulseTaskResult {
    const node = new PulseTaskNode(id, { rawEvents })
    return asyncMode ? node.processAsync() : node.process()
  }
}
