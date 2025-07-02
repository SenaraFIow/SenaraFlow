import { analyzeTokens } from "./tokenAnalytics"
import { exportTokenAnalytics } from "./tokenAnalyticsExporter"

const store = new JobStore()
const tracker = new JobTracker(store)

/**
 * Handler: run analytics and export results
 */
tracker.registerHandler("runAnalytics", async (_data) => {
  // Fetch latest on-chain data
  const transfers = await fetchTransferData()
  const activity = await fetchActivityData()
  // Analyze with predefined thresholds
  const report = analyzeTokens(transfers, activity, {
    transferThreshold: 100,
    volumeThreshold: 1000,
    suspicionWindowMs: 3600 * 1000,
  })
  // Export to CSV
  const files = await exportTokenAnalytics(report, { format: "csv", outputDir: "./reports" })
  return { files }
})

/**
 * Schedule and process the analytics job
 */
export async function scheduleAnalyticsJob() {
  const job = tracker.schedule("runAnalytics", {})
  await tracker.processPending()
  return store.getJob(job.id)
}