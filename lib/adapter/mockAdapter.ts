import type {
  DashboardDataAdapter,
  PanelFilter,
  PanelViewModel,
  ChartPoint,
  Trade,
} from "./types";

function genChartPoints(base: number, count: number, volatility: number): ChartPoint[] {
  const points: ChartPoint[] = [];
  let v = base;
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  for (let i = 0; i < count; i++) {
    v = v * (1 + (Math.random() - 0.48) * volatility);
    points.push({
      t: hours[i] ?? `${9 + i}:00`,
      v: Math.round(v * 100) / 100,
    });
  }
  return points;
}

const COMMODITY_DATA: Record<string, { symbol: string; base: number; volatility: number }> = {
  GOLD: { symbol: "GC=F", base: 2648, volatility: 0.0015 },
  SILBER: { symbol: "SI=F", base: 31.35, volatility: 0.002 },
  PLATIN: { symbol: "PL=F", base: 980, volatility: 0.0018 },
  KUPFER: { symbol: "HG=F", base: 4.25, volatility: 0.0025 },
  OEL: { symbol: "CL=F", base: 72.5, volatility: 0.003 },
};

const STOCK_SYMBOLS: Record<string, { symbol: string; price: number; change: number }> = {
  "Aktie:LONG": { symbol: "NVDA", price: 142.5, change: 1.2 },
  "Aktie:SHORT": { symbol: "TSLA", price: 248.3, change: -0.8 },
  "ETP:LONG": { symbol: "SPY", price: 585.2, change: 0.35 },
  "ETP:SHORT": { symbol: "SDS", price: 12.48, change: -0.12 },
};

function getSymbolAndPrice(filter: PanelFilter): { symbolLabel: string; price: number; changePct: number } {
  if (filter.commodityMode === "ROHSTOFF" && filter.commodityType) {
    const c = COMMODITY_DATA[filter.commodityType];
    if (c) {
      const price = c.base * (1 + (Math.random() - 0.5) * 0.02);
      return {
        symbolLabel: c.symbol,
        price,
        changePct: (price / c.base - 1) * 100,
      };
    }
  }
  const key = `${filter.assetClass}:${filter.direction}`;
  const s = STOCK_SYMBOLS[key] ?? STOCK_SYMBOLS["ETP:LONG"];
  return { symbolLabel: s.symbol, price: s.price, changePct: s.change };
}

function filterHash(filter: PanelFilter): string {
  return [
    filter.assetClass,
    filter.direction,
    filter.leverageMode,
    filter.leverageMultiplier ?? "-",
    filter.commodityMode,
    filter.commodityType ?? "-",
  ].join("|");
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function genTrades(filter: PanelFilter, symbolLabel: string): Trade[] {
  const hash = filterHash(filter);
  const seed = hash.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const rand = seededRandom(seed);

  const basePrice = symbolLabel.includes("=") ? 2654 : symbolLabel === "NVDA" ? 142 : symbolLabel === "TSLA" ? 248 : 585;
  const sizeMultiplier = symbolLabel.includes("=") ? 1 : symbolLabel === "NVDA" ? 10 : 1;

  const sizes = [2, 1, 3, 2, 1].map((s) => s * sizeMultiplier);
  const sides: ("LONG" | "SHORT")[] = [filter.direction, filter.direction === "LONG" ? "SHORT" : "LONG", filter.direction, filter.direction === "LONG" ? "SHORT" : "LONG", filter.direction];
  const tsList = ["13:42", "12:18", "11:55", "10:33", "09:22"];

  return tsList.map((ts, i) => {
    const side = sides[i]!;
    const price = basePrice * (0.99 + rand() * 0.03);
    const pnlUnreal = Math.floor((rand() - 0.4) * 400);
    return {
      id: `${hash}-${i}`,
      ts,
      symbol: symbolLabel,
      side,
      size: sizes[i]!,
      price,
      pnlEurUnreal: pnlUnreal,
    };
  });
}

export const mockAdapter: DashboardDataAdapter = {
  async getHeaderData(): Promise<{ headerTitle: string; nodeLabel: string; tickers: { key: string; label: string; price: number; changePct: number }[] }> {
    return {
      headerTitle: "EIX Risk Dashboard",
      nodeLabel: "NODE: FRANKFURT-DE-01",
      tickers: [
        { key: "GC=F", label: "Gold", price: 2654.2, changePct: 0.42 },
        { key: "SI=F", label: "Silver", price: 31.4, changePct: -0.18 },
        { key: "CL=F", label: "Öl", price: 72.45, changePct: -0.34 },
        { key: "GDAXI", label: "DAX", price: 19420, changePct: 0.38 },
        { key: "IXIC", label: "NASDAQ", price: 18245, changePct: 0.62 },
        { key: "BTC", label: "Bitcoin", price: 97320, changePct: 1.24 },
        { key: "ETH", label: "Ethereum", price: 3578, changePct: 0.89 },
        { key: "PL=F", label: "Platinum", price: 982.5, changePct: 0.12 },
      ],
    };
  },

  async getPanelData(panelId: "A" | "B" | "C", filter: PanelFilter): Promise<PanelViewModel> {
    const { symbolLabel, price, changePct } = getSymbolAndPrice(filter);
    const chartHidden = filter.commodityMode !== "ROHSTOFF" && filter.assetClass !== "Aktie";

    let chart: ChartPoint[] = [];
    if (!chartHidden) {
      if (filter.commodityMode === "ROHSTOFF" && filter.commodityType) {
        const c = COMMODITY_DATA[filter.commodityType];
        if (c) chart = genChartPoints(c.base, 9, c.volatility);
      } else if (filter.assetClass === "Aktie") {
        const key = `${filter.assetClass}:${filter.direction}`;
        const s = STOCK_SYMBOLS[key] ?? STOCK_SYMBOLS["ETP:LONG"];
        chart = genChartPoints(s.price, 9, 0.008);
      }
    }

    const hash = filterHash(filter);
    const seed = hash.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const rand = seededRandom(seed);
    const longPct = Math.floor(35 + rand() * 45);
    const shortPct = 100 - longPct;
    const longEur = Math.floor(60000 + rand() * 120000);
    const shortEur = Math.floor(40000 + rand() * 100000);
    const positions = { longPct, shortPct, longEur, shortEur };

    const titleParts = [
      filter.assetClass,
      filter.direction,
      filter.leverageMode === "MIT_HEBEL" && filter.leverageMultiplier
        ? `MIT HEBEL ${filter.leverageMultiplier}`
        : "OHNE HEBEL",
      filter.commodityMode,
    ];
    if (filter.commodityMode === "ROHSTOFF" && filter.commodityType) {
      titleParts.push(filter.commodityType);
    }
    const title = titleParts.join(" • ");

    return {
      id: panelId,
      filter,
      title,
      symbolLabel,
      price,
      changePct,
      chartHidden,
      chart,
      positions,
      trades: genTrades(filter, symbolLabel),
    };
  },
};
