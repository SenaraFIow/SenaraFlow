

import type { JobStore, JobRecord } from "./jobStore"

export type JobHandler = (data: any) => Promise<any> | any

export class JobTracker {
  private store: JobStore
  private handlers: Map<string, JobHandler> = new Map()

  constructor(store: JobStore) {
    this.store = store
  }

  /**
   * Register a handler for a specific job type.
   */
  registerHandler(type: string, handler: JobHandler) {
    this.handlers.set(type, handler)
  }

  /**
   * Schedule a new job and return its record.
   */
  schedule(type: string, data: any): JobRecord {
    if (!this.handlers.has(type)) {
      throw new Error(`No handler registered for job type "${type}"`)
    }
    return this.store.createJob(type, data)
  }

  /**
   * Process all pending jobs by invoking their handlers.
   */
  async processPending(): Promise<void> {
    const pending = this.store.listJobs("pending")
    for (const job of pending) {
      await this.runJob(job)
    }
  }

  private async runJob(job: JobRecord): Promise<void> {
    const handler = this.handlers.get(job.payload.type)
    if (!handler) {
      this.store.updateJob(job.id, { status: "failed", error: "Handler not found" })
      return
    }

    this.store.updateJob(job.id, { status: "running" })
    try {
      const result = await handler(job.payload.data)
      this.store.updateJob(job.id, { status: "completed", result })
    } catch (err: any) {
      this.store.updateJob(job.id, {
        status: "failed",
        error: err.message || String(err),
      })
    }
  }
}
