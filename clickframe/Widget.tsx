// MarketSentimentWidget.tsx
import React, { useEffect, useState } from "react"

interface MarketSentimentProps {
  symbol: string
}

export const MarketSentimentWidget: React.FC<MarketSentimentProps> = ({ symbol }) => {
  const [sentiment, setSentiment] = useState<number | null>(null)

  useEffect(() => {
    async function fetchSentiment() {
      // placeholder API call
      const res = await fetch(`/api/sentiment?symbol=${symbol}`)
      const json = await res.json()
      setSentiment(json.score)
    }
    fetchSentiment()
  }, [symbol])

  const color = sentiment! > 0 ? "text-green-600" : sentiment! < 0 ? "text-red-600" : "text-gray-600"

  return (
    <div className="card p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Market Sentiment: {symbol}</h2>
      {sentiment === null ? (
        <p>Loading...</p>
      ) : (
        <p className={`text-4xl font-bold ${color}`}>{(sentiment * 100).toFixed(1)}%</p>
      )}
    </div>
  )
}

export default MarketSentimentWidget
