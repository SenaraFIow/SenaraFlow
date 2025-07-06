import React, { Suspense, lazy } from "react"

// Lazy-load heavy widgets for faster initial load
const MarketSentimentWidget = lazy(() => import("./MarketSentimentWidget"))
const TokenOverviewPanel  = lazy(() => import("./TokenOverviewPanel"))
const WhaleAlertCard      = lazy(() => import("./WhaleAlertCard"))

interface AnalyzerDashboardProps {
  symbol?: string
  tokenId?: string
  pollIntervalMs?: number
}

const PanelContainer: React.FC<{ title: string }> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
    {children}
  </div>
)

export const AnalyzerDashboard: React.FC<AnalyzerDashboardProps> = React.memo(({
  symbol = "SOL",
  tokenId = "0x123456789abcdef",
  pollIntervalMs = 10000,
}) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        SenaraFlow Analyzer Dashboard
      </h1>
      {/* Future: add settings button or theme toggle here */}
    </header>

    <Suspense fallback={<div className="text-center py-10">Loading widgets…</div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PanelContainer title="Market Sentiment">
          <MarketSentimentWidget symbol={symbol} pollIntervalMs={pollIntervalMs} />
        </PanelContainer>

        <PanelContainer title="Token Overview">
          <TokenOverviewPanel tokenId={tokenId} pollIntervalMs={pollIntervalMs} />
        </PanelContainer>

        <PanelContainer title="Whale Alerts">
          <WhaleAlertCard pollIntervalMs={pollIntervalMs} />
        </PanelContainer>
      </div>
    </Suspense>
  </div>
))

export default AnalyzerDashboard
