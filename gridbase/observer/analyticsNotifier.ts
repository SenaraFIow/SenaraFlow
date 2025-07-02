
import nodemailer from "nodemailer"
import type { TokenAnalyticsReport } from "./tokenAnalytics"

interface NotifierConfig {
  smtpHost: string
  smtpPort: number
  user: string
  pass: string
  from: string
  to: string[]
}

/**
 * Sends a summary email of key analytics metrics.
 */
export async function sendAnalyticsSummary(
  report: TokenAnalyticsReport,
  config: NotifierConfig
) {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.user, pass: config.pass },
  })

  const totalTokens = report.groupSummary.length
  const suspiciousCount = report.suspicious.length
  const subject = `SenaraFlow Analytics: ${totalTokens} tokens, ${suspiciousCount} suspicious`
  const bodyLines = [
    `Total tokens analyzed: ${totalTokens}`,
    `Suspicious addresses detected: ${suspiciousCount}`,
    ``,
    `Top 5 tokens by volume:`,
    ...report.groupSummary
      .sort((a, b) => b.totalTransferred - a.totalTransferred)
      .slice(0, 5)
      .map(g => `• ${g.token}: ${g.totalTransferred}`),
  ]
  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject,
    text: bodyLines.join("\n"),
  })
}