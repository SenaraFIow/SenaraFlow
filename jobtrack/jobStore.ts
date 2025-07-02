
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

export const JobStatus = z.enum(["pending", "running", "completed", "failed"])
export type JobStatus = z.infer<typeof JobStatus>

export interface JobPayload {
  type: string
  data: any
}

export interface JobRecord {
  id: string
  payload: JobPayload
  status: JobStatus
  result?: any
  error?: string
  createdAt: number
  updatedAt: number
}

export class JobStore {
  private jobs: Map<string, JobRecord> = new Map()

  createJob(type: string, data: any): JobRecord {
    const id = uuidv4()
    const now = Date.now()
    const job: JobRecord = {
      id,
      payload: { type, data },
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }
    this.jobs.set(id, job)
    return job
  }

  getJob(id: string): JobRecord | undefined {
    return this.jobs.get(id)
  }

  listJobs(status?: JobStatus): JobRecord[] {
    const all = Array.from(this.jobs.values())
    return status ? all.filter(j => j.status === status) : all
  }

  updateJob(
    id: string,
    updates: Partial<Pick<JobRecord, "status" | "result" | "error">>
  ): JobRecord | undefined {
    const job = this.jobs.get(id)
    if (!job) return
    if (updates.status) job.status = updates.status
    if ("result" in updates) job.result = updates.result
    if ("error" in updates) job.error = updates.error
    job.updatedAt = Date.now()
    this.jobs.set(id, job)
    return job
  }
}
