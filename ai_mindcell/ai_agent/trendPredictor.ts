
import { MarketTrendPredictor, TrendSignal } from "./featureEngine"

/**
 * Oracle that uses price series to generate trading signals and advice.
 */
export class TrendPredictor {
  private predictor: MarketTrendPredictor

  constructor(prices: number[], timestamps: number[]) {
    this.predictor = new MarketTrendPredictor(prices, timestamps)
  }

  /**
   * Generate raw trend signals.
   */
  generateSignals(windowSize = 5): TrendSignal[] {
    return this.predictor.predict(windowSize)
  }

  /**
   * Provide buy/sell/hold advice for the top signals.
   */
  getAdvice(signals: TrendSignal[], topN = 3): Array<{ signal: TrendSignal; advice: "buy" | "sell" | "hold" }> {
    return signals
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topN)
      .map(sig => {
        let advice: "buy" | "sell" | "hold" = "hold"
        if (sig.signal === "Bullish" && sig.confidence > 60) advice = "buy"
        if (sig.signal === "Bearish" && sig.confidence > 60) advice = "sell"
        return { signal: sig, advice }
      })
  }
}