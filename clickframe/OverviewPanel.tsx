// TokenOverviewPanel.tsx
import React, { useEffect, useState } from "react"

interface TokenOverviewProps {
  tokenId: string
}

export const TokenOverviewPanel: React.FC<TokenOverviewProps> = ({ tokenId }) => {
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [holders, setHolders] = useState<number>(0)

  useEffect(() => {
    async function fetchOverview() {
      const res = await fetch(`/api/token-overview?id=${encodeURIComponent(tokenId)}`)
      const json = await res.json()
      setName(json.name)
      setPrice(json.priceUsd)
      setHolders(json.holders)
    }
    fetchOverview()
  }, [tokenId])

  return (
    <div className="card p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Token Overview</h2>
      <p><strong>ID:</strong> {tokenId}</p>
      <p><strong>Name:</strong> {name || "—"}</p>
      <p><strong>Price:</strong> ${price.toFixed(4)}</p>
      <p><strong>Holders:</strong> {holders.toLocaleString()}</p>
    </div>
  )
}

export default TokenOverviewPanel
