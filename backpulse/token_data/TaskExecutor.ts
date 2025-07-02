
import type { BackPulseEvent } from "../backpulse/typecast/pulseTypes"
import { castPulse } from "../backpulse/typecast/typeCaster"
import type { ObscuraTraceActionResponse } from "../core/actions/obscuraTraceActions"

export interface TaskConfig<T = any> {
  id: string
  type: string
  params: T
}

export interface TaskResult<R = any> {
  taskId: string
  success: boolean
  payload?: R
  error?: string
}

export class TaskExecutor {
  private tasks: TaskConfig[] = []

  register(task: TaskConfig): void {
    this.tasks.push(task)
  }

  async runAll(): Promise<TaskResult[]> {
    const results: TaskResult[] = []
    for (const t of this.tasks) {
      try {
        const data = await this.runOne(t)
        results.push({ taskId: t.id, success: true, payload: data })
      } catch (err: any) {
        results.push({ taskId: t.id, success: false, error: err.message })
      }
    }
    return results
  }

  private async runOne(task: TaskConfig): Promise<any> {
    switch (task.type) {
      case "backPulse":
        return (task.params.events as any[]).map(e => castPulse(e as BackPulseEvent))
      case "riskScan":
      case "whaleAlert":
        const { [`${task.type}Action`]: action } = await import(
          "../core/actions/obscuraTraceActions"
        )
        const resp = await action.execute({ payload: task.params, context: task.params.context })
        return (resp as ObscuraTraceActionResponse<any>).data
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }
  }
}
