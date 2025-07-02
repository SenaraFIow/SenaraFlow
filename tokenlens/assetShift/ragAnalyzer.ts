import type { RAGResponse } from "./ragRetriever"

export interface TokenLensInsight {
  profile: TokenLensProfile
  ragAnswer: string
  citedDocs: Array<{ id: string; snippet: string }>
  analysisTimestamp: number
}

export async function analyzeWithRAG(
  profile: TokenLensProfile,
  rag: RAGResponse
): Promise<TokenLensInsight> {
  // pick top 3 snippets
  const citedDocs = rag.sources.slice(0, 3).map(s => ({
    id: s.id,
    snippet: s.text.substring(0, 200) + (s.text.length > 200 ? "…" : "")
  }))

  return {
    profile,
    ragAnswer: rag.answer,
    citedDocs,
    analysisTimestamp: Date.now(),
  }
}