
import type {
  TokenAnalyticsReport,
  TokenGroupSummary,
  SuspiciousAddress
} from "./tokenAnalytics"
import fs from "fs"
import path from "path"

export interface ExportOptions {
  format: "json" | "csv"
  outputDir: string
}

/**
 * Export the analytics report to JSON or CSV files.
 */
export async function exportTokenAnalytics(
  report: TokenAnalyticsReport,
  opts: ExportOptions
): Promise<string[]> {
  const files: string[] = []
  await fs.promises.mkdir(opts.outputDir, { recursive: true })

  if (opts.format === "json") {
    const filePath = path.join(opts.outputDir, "tokenAnalyticsReport.json")
    await fs.promises.writeFile(filePath, JSON.stringify(report, null, 2))
    files.push(filePath)
  }

  if (opts.format === "csv") {
    // Export group summary
    const groupCsv = [
      "token,totalTransferred,uniqueSenders,uniqueReceivers",
      ...report.groupSummary.map(
        (g: TokenGroupSummary) =>
          `${g.token},${g.totalTransferred},${g.uniqueSenders},${g.uniqueReceivers}`
      ),
    ].join("\n")
    const groupPath = path.join(opts.outputDir, "groupSummary.csv")
    await fs.promises.writeFile(groupPath, groupCsv)
    files.push(groupPath)

    const suspCsv = [
      "address,score,reasons",
      ...report.suspicious.map((s: SuspiciousAddress) =>
        `${s.address},${s.score},"${s.reasons.join("; ")}"`
      ),
    ].join("\n")
    const suspPath = path.join(opts.outputDir, "suspiciousAddresses.csv")
    await fs.promises.writeFile(suspPath, suspCsv)
    files.push(suspPath)
  }

  return files
}
