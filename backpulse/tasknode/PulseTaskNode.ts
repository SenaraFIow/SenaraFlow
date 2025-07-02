
import type { BackPulseEvent } from "../typecast/pulseTypes"
import { castPulse } from "../typecast/typeCaster"

export interface PulseTaskPayload {
  rawEvents: unknown[]
}

export interface PulseTaskResult {
  events: BackPulseEvent[]
  processedAt: number
}

export class PulseTaskNode {
  id: string
  payload: PulseTaskPayload

  constructor(id: string, payload: PulseTaskPayload) {
    this.id = id
    this.payload = payload
  }

  /**
   * Validate and cast raw events into typed BackPulseEvent[]
   */
  process(): PulseTaskResult {
    const events: BackPulseEvent[] = []
    for (const raw of this.payload.rawEvents) {
      try {
        const evt = castPulse(raw as any)
        events.push(evt)
      } catch {
        // skip invalid
      }
    }
    return { events, processedAt: Date.now() }
  }
}