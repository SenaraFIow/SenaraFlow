
import React from "react"
import MarketSentimentWidget from "./MarketSentimentWidget"
import TokenOverviewPanel from "./TokenOverviewPanel"
import WhaleAlertCard from "./WhaleAlertCard"

export const AnalyzerDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">SenaraFlow Analyzer Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MarketSentimentWidget symbol="SOL" />
        <TokenOverviewPanel tokenId="0x123456789abcdef" />
        <WhaleAlertCard />
      </div>
    </div>
  )
}

export default AnalyzerDashboard
