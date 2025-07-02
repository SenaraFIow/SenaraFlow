// senaraflow/tokenlens/reportGenerator.ts

import type { TokenLensInsight } from "./ragAnalyzer"
import PDFDocument from "pdfkit"
import fs from "fs"

export async function generateTokenLensReport(
  insight: TokenLensInsight,
  outputPath: string
): Promise<void> {
  const doc = new PDFDocument({ margin: 40 })
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)

  doc.fontSize(20).text(`TokenLens Report: ${insight.profile.symbol}`, { align: "center" })
  doc.moveDown()

  doc.fontSize(12).text(`Name: ${insight.profile.name}`)
  doc.text(`Holders: ${insight.profile.holders}`)
  doc.text(`Market Cap (USD): $${insight.profile.marketCapUsd.toLocaleString()}`)
  doc.text(`24h Volume (USD): $${insight.profile.volume24hUsd.toLocaleString()}`)
  doc.text(`Liquidity Score: ${insight.profile.liquidityScore}`)
  doc.text(`Risk Score: ${insight.profile.riskScore}`)
  doc.moveDown()

  doc.fontSize(14).text("RAG Analysis", { underline: true })
  doc.fontSize(12).text(insight.ragAnswer)
  doc.moveDown()

  doc.fontSize(14).text("Top Sources", { underline: true })
  insight.citedDocs.forEach((d, i) => {
    doc.fontSize(12).text(`${i + 1}. [${d.id}] ${d.snippet}`)
    doc.moveDown(0.5)
  })

  doc.end()
  return new Promise(resolve => stream.on("finish", resolve))
}
