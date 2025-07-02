

import type { ApiResponse } from "./apiClient"

export interface RawRecord {
  id: string
  timestamp: string
  payload: any
}

export interface ProcessedRecord {
  id: string
  time: number
  fields: Record<string, any>
}

/**
 * Transform raw API data into strongly typed, normalized records.
 */
export function transformRecords(
  response: ApiResponse<RawRecord[]>
): ProcessedRecord[] {
  if (!response.success) return []
  return response.data.map(raw => {
    const time = Date.parse(raw.timestamp)
    const fields: Record<string, any> = {}
    // flatten payload key-values into fields
    Object.entries(raw.payload || {}).forEach(([k, v]) => {
      fields[k] = v
    })
    return { id: raw.id, time, fields }
  })
}
