
import type { PulseTaskTaskConfig, PulseTaskResult } from "./PulseTaskNode"
import { PulseTaskNode } from "./PulseTaskNode"

/**
 * Configuration for running a PulseTaskNode.
 */
export interface PulseTaskTaskConfig {
  nodeId: string
  rawEvents: unknown[]
  onComplete?: (result: PulseTaskResult) => void
  onError?: (error: Error) => void
}

/**
 * Runner that instantiates and executes PulseTaskNode based on config.
 */
export class TaskNodeRunner {
  async run(config: PulseTaskTaskConfig): Promise<PulseTaskResult | void> {
    try {
      const node = new PulseTaskNode(config.nodeId, { rawEvents: config.rawEvents })
      const result = node.process()
      if (config.onComplete) config.onComplete(result)
      return result
    } catch (err: any) {
      if (config.onError) config.onError(err)
      else throw err
    }
  }
}