s

import { anomalyScanAction, tokenAnalyticsAction } from "../actions/senaraFlowActions"
import type { SenaraFlowActionResponse } from "../actions/senaraFlowActions"

/**
 * The central agent for SenaraFlow: dispatches action requests and returns results.
 */
export class SenaraFlowAgent {
  constructor(private apiEndpoint: string, private apiKey: string) {}

  async runAnomalyScan(contractAddress: string, hours: number): Promise<SenaraFlowActionResponse<any>> {
    return anomalyScanAction.execute({
      payload: { contractAddress, lookbackHours: hours },
      context: { apiEndpoint: this.apiEndpoint, apiKey: this.apiKey }
    })
  }

  async runTokenAnalytics(tokenId: string, windowMinutes: number): Promise<SenaraFlowActionResponse<any>> {
    return tokenAnalyticsAction.execute({
      payload: { tokenId, windowMinutes },
      context: { apiEndpoint: this.apiEndpoint, apiKey: this.apiKey }
    })
  }
}