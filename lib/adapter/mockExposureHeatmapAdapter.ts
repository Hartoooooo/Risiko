import type { ExposureHeatmapAdapter, ExposureHeatmapData, ExposureHeatmapTile } from "./types";

function createTile(
  id: string,
  type: "COMMODITY" | "CRYPTO" | "INDEX",
  key: string,
  label: string,
  ticker: string,
  longEur: number,
  shortEur: number
): ExposureHeatmapTile {
  const totalExposureEur = longEur + shortEur;
  const netExposureEur = longEur - shortEur;
  const netDirection =
    netExposureEur > 0 ? "NET_LONG" : netExposureEur < 0 ? "NET_SHORT" : "NEUTRAL";
  return {
    id,
    type,
    key,
    label,
    ticker,
    longExposureEur: longEur,
    shortExposureEur: shortEur,
    totalExposureEur,
    netExposureEur,
    netDirection,
  };
}

class MockExposureHeatmapAdapter implements ExposureHeatmapAdapter {
  async getExposureHeatmap(): Promise<ExposureHeatmapData> {
    const commodities: ExposureHeatmapTile[] = [
      createTile("gold", "COMMODITY", "GOLD", "Gold", "GC=F", 185000, 42000),
      createTile("silver", "COMMODITY", "SILVER", "Silver", "SI=F", 78000, 95000),
      createTile("oil", "COMMODITY", "OIL", "Oil", "CL=F", 62000, 31000),
      createTile("platinum", "COMMODITY", "PLATINUM", "Platinum", "PL=F", 45000, 12000),
      createTile("copper", "COMMODITY", "COPPER", "Copper", "HG=F", 28000, 35000),
    ];

    const indices: ExposureHeatmapTile[] = [
      createTile("dax", "INDEX", "DAX", "DAX", "^GDAXI", 125000, 45000),
      createTile("nasdaq", "INDEX", "NASDAQ", "NASDAQ", "^IXIC", 98000, 72000),
    ];

    const crypto: ExposureHeatmapTile[] = [
      createTile("btc", "CRYPTO", "BTC", "Bitcoin", "BTCUSD", 340000, 96000),
      createTile("eth", "CRYPTO", "ETH", "Ethereum", "ETHUSD", 89000, 42000),
      createTile("sol", "CRYPTO", "SOL", "Solana", "SOLUSD", 55000, 18000),
      createTile("bnb", "CRYPTO", "BNB", "BNB", "BNBUSD", 22000, 8000),
      createTile("xrp", "CRYPTO", "XRP", "XRP", "XRPUSD", 15000, 9000),
    ];

    const tiles = [...commodities, ...indices, ...crypto].sort(
      (a, b) => Math.abs(b.totalExposureEur) - Math.abs(a.totalExposureEur)
    );

    const maxAbsTotalExposureEur = Math.max(
      ...tiles.map((t) => Math.abs(t.totalExposureEur)),
      1
    );

    return {
      tiles,
      maxAbsTotalExposureEur,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const mockExposureHeatmapAdapter = new MockExposureHeatmapAdapter();
