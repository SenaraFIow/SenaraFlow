import React, { useEffect, useState } from "react"
import axios from "axios"

type TokenOverview = {
  id: string
  name: string
  priceUsd: number
  holders: number
}

interface TokenOverviewPanelProps {
  tokenId: string
}

export const TokenOverviewPanel: React.FC<TokenOverviewPanelProps> = ({ tokenId }) => {
  const [data, setData] = useState<TokenOverview | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const source = axios.CancelToken.source()

    const fetchOverview = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get<TokenOverview>(
          `/api/token-overview`,
          { 
            params: { id: tokenId },
            cancelToken: source.token
          }
        )
        if (isMounted) setData(response.data)
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          setError(err.message || "Failed to load token overview")
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOverview()

    return () => {
      isMounted = false
      source.cancel("Operation canceled by the user.")
    }
  }, [tokenId])

  if (loading) {
    return (
      <div className="card p-4 bg-white rounded shadow flex justify-center items-center">
        <span className="animate-pulse">Loading token data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-4 bg-red-50 rounded shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="card p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Token Overview</h2>
      <p><strong>ID:</strong> {data.id}</p>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Price:</strong> ${data.priceUsd.toFixed(4)}</p>
      <p><strong>Holders:</strong> {data.holders.toLocaleString()}</p>
    </div>
  )
}

export default TokenOverviewPanel
