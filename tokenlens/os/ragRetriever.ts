
const PINECONE_INDEX = process.env.PINECONE_INDEX || "tokenlens-index"
const PINECONE_ENV = process.env.PINECONE_ENV || ""
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""

export async function createTokenLensRAGChain() {
  // init Pinecone
  const pinecone = new PineconeClient()
  await pinecone.init({ environment: PINECONE_ENV, apiKey: process.env.PINECONE_KEY! })
  const index = pinecone.Index(PINECONE_INDEX)

  // embeddings & retriever
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY })
  const vectorStore = await index.asVectorStore(embeddings, {
    namespace: "token-profiles",
    textKey: "text",
    idKey: "id",
  })
  const retriever = vectorStore.asRetriever({ topK: 5 })

  // QA chain
  const llm = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.2 })
  const chain = RetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: true,
    chainType: "map_reduce",
  })

  return chain
}

export type RAGResponse = {
  answer: string
  sources: { id: string; text: string }[]
}

export async function queryTokenLensRAG(query: string): Promise<RAGResponse> {
  const chain = await createTokenLensRAGChain()
  const result = await chain.call({ query })
  return {
    answer: result.text,
    sources: result.sourceDocuments.map(doc => ({
      id: doc.metadata.id as string,
      text: doc.pageContent,
    })),
  }
}