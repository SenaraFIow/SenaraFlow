
export interface TransferEntropyInput {
  addresses: string[]    // sequence of addresses participating in transfers
}

/**
 * Compute Shannon entropy (in bits) of a sequence.
 */
export function analyzeTransactionEntropy(
  addresses: string[]
): number {
  const freq: Record<string, number> = {}
  addresses.forEach(a => freq[a] = (freq[a] || 0) + 1)
  const total = addresses.length
  let entropy = 0
  for (const count of Object.values(freq)) {
    const p = count / total
    entropy -= p * Math.log2(p)
  }
  // round to 3 decimals
  return Math.round(entropy * 1000) / 1000
}