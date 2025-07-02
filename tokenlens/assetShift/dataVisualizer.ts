// senaraflow/tokenlens/dataVisualizer.ts

import type { TokenLensInsight } from "./ragAnalyzer"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"

interface VisualizationOptions {
  width: number
  height: number
  theme?: "light" | "dark"
}

export async function renderTokenLensInsightChart(
  insight: TokenLensInsight,
  opts: VisualizationOptions = { width: 800, height: 400, theme: "light" }
): Promise<Buffer> {
  const labels = insight.citedDocs.map(d => d.id)
  const data = insight.citedDocs.map(d => d.snippet.length)
  const chart = new ChartJSNodeCanvas({ width: opts.width, height: opts.height, backgroundColour: opts.theme === "dark" ? "#2e2e2e" : "#ffffff" })
  const configuration = {
    type: "bar" as const,
    data: {
      labels,
      datasets: [
        {
          label: "Snippet Length",
          data,
          backgroundColor: opts.theme === "dark" ? "#6C63FF" : "#4A90E2",
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        title: { display: true, text: `Analysis at ${new Date(insight.analysisTimestamp).toLocaleString()}` },
      },
    },
  }
  return chart.renderToBuffer(configuration)
}
