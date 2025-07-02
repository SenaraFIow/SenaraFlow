
export type Chain =  "solana"

const EXPLORER_URLS: Record<Chain, string> = {

  solana: "https://explorer.solana.com/tx/",
}

/**
 * Build a transaction explorer URL for a given chain and tx hash.
 * @param chain Name of the chain
 * @param txHash Transaction hash/string
 * @param cluster Optional Solana cluster ("mainnet-beta", "testnet", "devnet")
 */
export function buildTxLink(
  chain: Chain,
  txHash: string,
  cluster?: "mainnet-beta" | "testnet" | "devnet"
): string {
  let base = EXPLORER_URLS[chain]
  if (chain === "solana" && cluster) {
    base += `?cluster=${cluster}&`
  }
  return `${base}${encodeURIComponent(txHash)}`
}
