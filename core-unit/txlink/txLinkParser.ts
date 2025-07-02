
export type ParsedTxLink = {
  chain: string
  txHash: string
  cluster?: string
}

/**
 * Parse a transaction explorer URL back into its components.
 * Supports Etherscan-family and Solana Explorer links.
 * @param url Full explorer URL
 */
export function parseTxLink(url: string): ParsedTxLink | null {
  try {
    const u = new URL(url)
    let chain = ""
    let txHash = ""
    let cluster: string | undefined

    if (u.hostname.includes("etherscan.io")) {
      chain = "ethereum"
      txHash = u.pathname.split("/tx/")[1] || ""
    } else if (u.hostname.includes("polygonscan.com")) {
      chain = "polygon"
      txHash = u.pathname.split("/tx/")[1] || ""
    } else if (u.hostname.includes("arbiscan.io")) {
      chain = "arbitrum"
      txHash = u.pathname.split("/tx/")[1] || ""
    } else if (u.hostname.includes("optimistic.etherscan.io")) {
      chain = "optimism"
      txHash = u.pathname.split("/tx/")[1] || ""
    } else if (u.hostname.includes("solana.com")) {
      chain = "solana"
      txHash = u.pathname.split("/tx/")[1] || ""
      if (u.searchParams.has("cluster")) {
        cluster = u.searchParams.get("cluster") || undefined
      }
    } else {
      return null
    }

    if (!txHash) return null
    return { chain, txHash, cluster }
  } catch {
    return null
  }
}
