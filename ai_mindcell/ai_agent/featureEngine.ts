
import { TokenFeatureExtractor, FeatureVector } from "../core/senaraFlowActions"

/**
 * Engine that applies on-chain feature extraction to raw price/volume data.
 */
export class FeatureEngine {
  private extractor: TokenFeatureExtractor

  constructor(priceData: { timestamp: number; price: number }[], volumeData: { timestamp: number; volume: number }[]) {
    this.extractor = new TokenFeatureExtractor(priceData, volumeData)
  }

  extractFeatures(): FeatureVector[] {
    return this.extractor.extract()
  }

  /**
   * Annotate feature vectors with Lens insights (if available).
   */
  annotateWithLens(features: FeatureVector[], insights: LensInsights[]): Array<FeatureVector & { lensScore: number }> {
    // naive merge by timestamp
    return features.map(fv => {
      const insight = insights.find(ins => ins.analysisTimestamp >= fv.timestamp - 60000 && ins.analysisTimestamp <= fv.timestamp + 60000)
      return { ...fv, lensScore: insight ? insight.healthIndicator === "Good" ? 1 : insight.healthIndicator === "Fair" ? 0.5 : 0 : 0 }
    })
  }
}