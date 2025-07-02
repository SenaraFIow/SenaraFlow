
import { z } from "zod"
import type { RawPulseEvent, BackPulseEvent } from "./pulseTypes"

const TransactionPulseSchema = z.object({
  timestamp: z.union([z.number(), z.string().transform(str => parseInt(str, 10))]),
  eventType: z.literal("transaction"),
  payload: z.object({
    txHash: z.string(),
    amount: z.number(),
    token: z.string()
  })
})

const SentimentPulseSchema = z.object({
  timestamp: z.union([z.number(), z.string().transform(str => parseInt(str, 10))]),
  eventType: z.literal("sentiment"),
  payload: z.object({
    symbol: z.string(),
    score: z.number().min(-1).max(1)
  })
})

const AnomalyPulseSchema = z.object({
  timestamp: z.union([z.number(), z.string().transform(str => parseInt(str, 10))]),
  eventType: z.literal("anomaly"),
  payload: z.object({
    description: z.string(),
    severity: z.enum(["low", "medium", "high"])
  })
})

const RawSchema = z.union([TransactionPulseSchema, SentimentPulseSchema, AnomalyPulseSchema])

/**
 * Cast a raw event to a strongly typed BackPulseEvent, or throw on invalid.
 */
export function castPulse(event: RawPulseEvent): BackPulseEvent {
  const parsed = RawSchema.safeParse(event)
  if (!parsed.success) {
    throw new Error(`Invalid pulse event: ${parsed.error.issues.map(i=>i.message).join("; ")}`)
  }
  const { timestamp, eventType, payload } = parsed.data
  const ts = typeof timestamp === "string" ? parseInt(timestamp,10) : timestamp

  switch (eventType) {
    case "transaction":
      return {
        type: "transaction",
        timestamp: ts,
        txHash: payload.txHash,
        amount: payload.amount,
        token: payload.token
      }
    case "sentiment":
      return {
        type: "sentiment",
        timestamp: ts,
        symbol: payload.symbol,
        score: payload.score
      }
    case "anomaly":
      return {
        type: "anomaly",
        timestamp: ts,
        description: payload.description,
        severity: payload.severity
      }
    default:
      // unreachable thanks to Zod literal
      throw new Error(`Unsupported eventType: ${eventType}`)
  }
}

/**
 * Process an array of raw events into typed pulses, filtering invalid ones.
 */
export function castPulseStream(events: RawPulseEvent[]): BackPulseEvent[] {
  return events.map(evt => {
    try {
      return castPulse(evt)
    } catch {
      // skip invalid event
      return null
    }
  }).filter((e): e is BackPulseEvent => e !== null)
}
