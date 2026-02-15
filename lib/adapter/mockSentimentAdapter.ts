import type { SentimentAdapter, SentimentGaugeData } from "./types";

class MockSentimentAdapter implements SentimentAdapter {
  async getSentimentGauges(): Promise<SentimentGaugeData[]> {
    // Simuliere realistische Werte für Gold, Silber, Bitcoin
    return [
      {
        key: "gold",
        label: "GOLD SENTIMENT",
        symbol: "GC=F",
        longPct: 65,
        shortPct: 35,
        longExposureEur: 125000,
        shortExposureEur: 67500,
        totalExposureEur: 192500,
        netDirectionLabel: "NET LONG",
      },
      {
        key: "silver",
        label: "SILVER SENTIMENT",
        symbol: "SI=F",
        longPct: 42,
        shortPct: 58,
        longExposureEur: 58000,
        shortExposureEur: 80000,
        totalExposureEur: 138000,
        netDirectionLabel: "NET SHORT",
      },
      {
        key: "bitcoin",
        label: "CRYPTO SENTIMENT",
        symbol: "BTCUSD",
        longPct: 78,
        shortPct: 22,
        longExposureEur: 340000,
        shortExposureEur: 96000,
        totalExposureEur: 436000,
        netDirectionLabel: "NET LONG",
      },
    ];
  }
}

export const mockSentimentAdapter = new MockSentimentAdapter();
