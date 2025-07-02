

import { z } from "zod"

// Base schema for SenaraFlow actions
export type SenaraFlowSchema = z.ZodObject<z.ZodRawShape>

// Standardized response for any action
export interface SenaraFlowActionResponse<T> {
  notice: string
  data?: T
}

// Core structure defining a SenaraFlow action
export interface SenaraFlowActionCore<
  S extends SenaraFlowSchema,
  R,
  Ctx = unknown
> {
  id: string
  summary: string
  input: S
  execute: (
    args: {
      payload: z.infer<S>
      context: Ctx
    }
  ) => Promise<SenaraFlowActionResponse<R>>
}

// Union type for any SenaraFlow action
export type SenaraFlowAction = SenaraFlowActionCore<SenaraFlowSchema, unknown, unknown>

// Example: on-chain anomaly scan action
export const anomalyScanAction: SenaraFlowActionCore<
  z.ZodObject<{ 
    contractAddress: z.ZodString; 
    lookbackHours: z.ZodNumber 
  }>,
  { anomalies: Array<{ type: string; timestamp: number }> },
  { apiEndpoint: string; apiKey: string }
> = {
  id: "anomalyScan",
  summary: "Scan a contract for on-chain anomalies over a timeframe",
  input: z.object({
    contractAddress: z.string().min(32),
    lookbackHours: z.number().int().positive(),
  }),
  execute: async ({ payload, context }) => {
    const { contractAddress, lookbackHours } = payload
    const { apiEndpoint, apiKey } = context

    const resp = await fetch(
      `${apiEndpoint}/senaraflow/anomalies?address=${encodeURIComponent(contractAddress)}&hours=${lookbackHours}`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    if (!resp.ok) throw new Error(`Anomaly scan failed: ${resp.status} ${resp.statusText}`)

    const json = await resp.json()
    return {
      notice: `Anomaly scan complete for ${contractAddress}`,
      data: { anomalies: json.anomalies as any[] },
    }
  },
}

// Example: token analytics action
export const tokenAnalyticsAction: SenaraFlowActionCore<
  z.ZodObject<{
    tokenId: z.ZodString
    windowMinutes: z.ZodNumber
  }>,
  {
    summary: { totalTransfers: number; totalVolume: number }
    topSuspicious: Array<{ address: string; score: number }>
  },
  { apiEndpoint: string; apiKey: string }
> = {
  id: "tokenAnalytics",
  summary: "Run token transfer & volume analytics for a given token",
  input: z.object({
    tokenId: z.string().min(1),
    windowMinutes: z.number().int().positive(),
  }),
  execute: async ({ payload, context }) => {
    const { tokenId, windowMinutes } = payload
    const { apiEndpoint, apiKey } = context

    const resp = await fetch(
      `${apiEndpoint}/senaraflow/token-analytics?id=${encodeURIComponent(tokenId)}&window=${windowMinutes}`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    if (!resp.ok) throw new Error(`Token analytics failed: ${resp.status} ${resp.statusText}`)

    const json = await resp.json()
    return {
      notice: `Analytics complete for token ${tokenId}`,
      data: {
        summary: json.summary,
        topSuspicious: json.suspicious as any[],
      },
    }
  },
}
