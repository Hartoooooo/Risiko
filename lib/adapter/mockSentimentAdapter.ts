import type { SentimentAdapter, SentimentGaugeData } from "./types";

class MockSentimentAdapter implements SentimentAdapter {
  async getSentimentGauges(): Promise<SentimentGaugeData[]> {
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
      {
        key: "oil",
        label: "OIL SENTIMENT",
        symbol: "CL=F",
        longPct: 55,
        shortPct: 45,
        longExposureEur: 95000,
        shortExposureEur: 78000,
        totalExposureEur: 173000,
        netDirectionLabel: "NET LONG",
      },
      {
        key: "platinum",
        label: "PLATINUM SENTIMENT",
        symbol: "PL=F",
        longPct: 38,
        shortPct: 62,
        longExposureEur: 48000,
        shortExposureEur: 78000,
        totalExposureEur: 126000,
        netDirectionLabel: "NET SHORT",
      },
      {
        key: "dax",
        label: "DAX SENTIMENT",
        symbol: "^GDAXI",
        longPct: 72,
        shortPct: 28,
        longExposureEur: 210000,
        shortExposureEur: 82000,
        totalExposureEur: 292000,
        netDirectionLabel: "NET LONG",
      },
    ];
  }
}

export const mockSentimentAdapter = new MockSentimentAdapter();
