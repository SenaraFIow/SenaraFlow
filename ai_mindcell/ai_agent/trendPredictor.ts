import { MarketTrendPredictor, TrendSignal } from "./featureEngine"

/** Possible advice recommendations */
export enum Advice {
  BUY = "buy",
  SELL = "sell",
  HOLD = "hold",
}

/** Configuration for advice generation */
export interface AdviceConfig {
  confidenceThreshold: number   // e.g. 60
  topCount: number              // how many signals to advise on
}

/**
 * Oracle that uses price series to generate trading signals and advice.
 */
export class TrendPredictor {
  private predictor: MarketTrendPredictor

  constructor(prices: number[], timestamps: number[]) {
    if (prices.length !== timestamps.length || prices.length === 0) {
      throw new Error("Prices and timestamps must be non-empty arrays of equal length")
    }
    this.predictor = new MarketTrendPredictor(prices, timestamps)
  }

  /**
   * Generate raw trend signals.
   * @param windowSize — lookback window for prediction (default: 5)
   */
  generateSignals(windowSize = 5): TrendSignal[] {
    if (windowSize <= 0) {
      throw new Error("windowSize must be a positive integer")
    }
    return this.predictor.predict(windowSize)
  }

  /**
   * Provide buy/sell/hold advice for the top signals.
   *
   * @param signals — array of raw signals (if empty, returns empty advice)
   * @param config — configure `confidenceThreshold` and `topCount`
   */
  getAdvice(
    signals: TrendSignal[],
    config: AdviceConfig = { confidenceThreshold: 60, topCount: 3 }
  ): Array<{ signal: TrendSignal; advice: Advice }> {
    const { confidenceThreshold, topCount } = config

    return signals
      .slice()                                    // copy
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topCount)
      .map(sig => ({
        signal: sig,
        advice: this.decideAdvice(sig, confidenceThreshold),
      }))
  }

  /** Internal rule engine for mapping a single signal to Advice */
  private decideAdvice(sig: TrendSignal, threshold: number): Advice {
    switch (sig.signal) {
      case "Bullish":
        return sig.confidence > threshold ? Advice.BUY : Advice.HOLD
      case "Bearish":
        return sig.confidence > threshold ? Advice.SELL : Advice.HOLD
      default:
        return Advice.HOLD
    }
  }

  /**
   * Convenience method: run an end-to-end forecast + advice
   */
  forecast(
    windowSize = 5,
    config: AdviceConfig = { confidenceThreshold: 60, topCount: 3 }
  ): Array<{ signal: TrendSignal; advice: Advice }> {
    const signals = this.generateSignals(windowSize)
    return this.getAdvice(signals, config)
  }
}
