import type {
  AnalyticsAdapter,
  PanelFilter,
  FilterScope,
  TimeWindow,
  InstrumentRef,
  ExposurePoint,
  ExposureSummary,
  OpenTrade,
  ExposureÜberfilter,
  ExposureCommodityFilter,
} from "./types";

const SYMBOL_TO_COMMODITY: Record<string, "GOLD" | "SILBER" | "PLATIN" | "KUPFER" | "OEL"> = {
  "GC=F": "GOLD",
  "SI=F": "SILBER",
  "PL=F": "PLATIN",
  "HG=F": "KUPFER",
  "CL=F": "OEL",
};

type FilterProfile = Pick<
  PanelFilter,
  "assetClass" | "direction" | "leverageMode" | "commodityMode" | "leverageMultiplier" | "commodityType"
>;

function tradeMatchesFilter(profile: FilterProfile, filter: PanelFilter): boolean {
  if (profile.assetClass !== filter.assetClass) return false;
  if (profile.direction !== filter.direction) return false;
  if (profile.leverageMode !== filter.leverageMode) return false;
  if (profile.commodityMode !== filter.commodityMode) return false;
  if (filter.leverageMode === "MIT_HEBEL" && profile.leverageMultiplier !== filter.leverageMultiplier) return false;
  if (filter.commodityMode === "ROHSTOFF" && profile.commodityType !== filter.commodityType) return false;
  return true;
}

function tradesForScope(
  allTrades: (OpenTrade & { _profile: FilterProfile })[],
  scope: FilterScope,
  scopeMap: { A: PanelFilter; B: PanelFilter; C: PanelFilter }
): OpenTrade[] {
  if (scope === "ALL_PANELS_UNION") {
    const seen = new Set<string>();
    return allTrades.filter((t) => {
      const matchA = tradeMatchesFilter(t._profile, scopeMap.A);
      const matchB = tradeMatchesFilter(t._profile, scopeMap.B);
      const matchC = tradeMatchesFilter(t._profile, scopeMap.C);
      if (matchA || matchB || matchC) {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      }
      return false;
    }).map((t) => {
      const { _profile: _, ...rest } = t as OpenTrade & { _profile: FilterProfile };
      return rest;
    });
  }
  const filter = scope === "PANEL_A" ? scopeMap.A : scope === "PANEL_B" ? scopeMap.B : scopeMap.C;
  return allTrades.filter((t) => tradeMatchesFilter(t._profile, filter)).map((t) => {
    const { _profile: _, ...rest } = t as OpenTrade & { _profile: FilterProfile };
    return rest;
  });
}

function tradesForÜberfilter(
  allTrades: (OpenTrade & { _profile: FilterProfile })[],
  überfilter: ExposureÜberfilter
): OpenTrade[] {
  if (überfilter === "ALL") {
    return allTrades.map((t) => {
      const { _profile: _, ...rest } = t as OpenTrade & { _profile: FilterProfile };
      return rest;
    });
  }
  const basket = überfilter === "BER" ? "EIX_B" : "EIX_M";
  return allTrades
    .filter((t) => (t as OpenTrade & { _profile: FilterProfile }).basket === basket)
    .map((t) => {
      const { _profile: _, ...rest } = t as OpenTrade & { _profile: FilterProfile };
      return rest;
    });
}

function tradesForCommodity(
  trades: OpenTrade[],
  commodityFilter: ExposureCommodityFilter
): OpenTrade[] {
  if (commodityFilter === "ALL") return trades;
  return trades.filter((t) => t.commodityType === commodityFilter);
}

const MOCK_INSTRUMENTS: InstrumentRef[] = [
  { name: "NVIDIA Corp", isin: "US67066G1040", wkn: null, ticker: "NVDA", exchange: "NASDAQ" },
  { name: "Tesla Inc", isin: "US88160R1014", wkn: null, ticker: "TSLA", exchange: "NASDAQ" },
  { name: "SPDR S&P 500 ETF", isin: "US78462F1030", wkn: "A0YEDG", ticker: "SPY", exchange: "NYSE" },
  { name: "ProShares UltraShort S&P500", isin: "US74322M8302", wkn: null, ticker: "SDS", exchange: "NYSE" },
  { name: "Gold Futures", isin: null, wkn: null, ticker: "GC=F", exchange: "COMEX" },
  { name: "Silver Futures", isin: null, wkn: null, ticker: "SI=F", exchange: "COMEX" },
  { name: "Platinum Futures", isin: null, wkn: null, ticker: "PL=F", exchange: "NYMEX" },
  { name: "Copper Futures", isin: null, wkn: null, ticker: "HG=F", exchange: "COMEX" },
  { name: "Crude Oil WTI", isin: null, wkn: null, ticker: "CL=F", exchange: "NYMEX" },
  { name: "iShares Gold ETF", isin: "DE000A0S9GB0", wkn: "A0S9GB", ticker: "SGLD", exchange: "XETRA" },
  { name: "Xtrackers DAX ETF", isin: "DE0007236101", wkn: "723610", ticker: "DAX", exchange: "XETRA" },
];

const FILTER_PROFILES: FilterProfile[] = [
  { assetClass: "Aktie", direction: "LONG", leverageMode: "OHNE_HEBEL", commodityMode: "KEIN_ROHSTOFF", leverageMultiplier: null, commodityType: null },
  { assetClass: "Aktie", direction: "SHORT", leverageMode: "OHNE_HEBEL", commodityMode: "KEIN_ROHSTOFF", leverageMultiplier: null, commodityType: null },
  { assetClass: "ETP", direction: "LONG", leverageMode: "OHNE_HEBEL", commodityMode: "KEIN_ROHSTOFF", leverageMultiplier: null, commodityType: null },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "OHNE_HEBEL", commodityMode: "KEIN_ROHSTOFF", leverageMultiplier: null, commodityType: null },
  { assetClass: "ETP", direction: "LONG", leverageMode: "MIT_HEBEL", commodityMode: "KEIN_ROHSTOFF", leverageMultiplier: "2x", commodityType: null },
  { assetClass: "ETP", direction: "LONG", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "GOLD" },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "3x", commodityType: "OEL" },
  { assetClass: "ETP", direction: "LONG", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "SILBER" },
  { assetClass: "ETP", direction: "LONG", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "PLATIN" },
  { assetClass: "ETP", direction: "LONG", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "KUPFER" },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "GOLD" },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "SILBER" },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "PLATIN" },
  { assetClass: "ETP", direction: "SHORT", leverageMode: "MIT_HEBEL", commodityMode: "ROHSTOFF", leverageMultiplier: "2x", commodityType: "KUPFER" },
];

const SYMBOL_BY_PROFILE: Record<number, string> = {
  0: "NVDA",
  1: "TSLA",
  2: "SPY",
  3: "SDS",
  4: "SPY",
  5: "GC=F",
  6: "CL=F",
  7: "SI=F",
  8: "PL=F",
  9: "HG=F",
  10: "GC=F",
  11: "SI=F",
  12: "PL=F",
  13: "HG=F",
};

function genMockTrades(): (OpenTrade & { _profile: FilterProfile })[] {
  const trades: (OpenTrade & { _profile: FilterProfile })[] = [];
  const now = new Date();
  const instruments = MOCK_INSTRUMENTS;

  FILTER_PROFILES.forEach((profile, idx) => {
    const symbol = SYMBOL_BY_PROFILE[idx] ?? "SPY";
    const inst = instruments.find((i) => i.ticker === symbol || i.name.includes(symbol)) ?? instruments[0]!;
    const basePrice = symbol === "NVDA" ? 142 : symbol === "TSLA" ? 248 : symbol === "GC=F" ? 2650 : symbol === "CL=F" ? 72 : 585;
    const sizes = [10, 5, 20, 8, 15, 12, 7];

    const shortScale = profile.direction === "SHORT" ? 0.45 : 1;
    for (let i = 0; i < sizes.length; i++) {
      const entryPrice = basePrice * (0.97 + Math.random() * 0.06);
      const markPrice = entryPrice * (0.98 + Math.random() * 0.05);
      const size = sizes[i]!;
      const baseExposure = size * markPrice * (profile.leverageMultiplier ? parseInt(profile.leverageMultiplier, 10) : 1);
      const exposureEur = baseExposure * shortScale;
      const pnlEur = (markPrice - entryPrice) * size * (profile.direction === "LONG" ? 1 : -1) * (profile.leverageMultiplier ? parseInt(profile.leverageMultiplier, 10) : 1);
      const d = new Date(now);
      d.setHours(d.getHours() - i * 3 - Math.floor(Math.random() * 5));

      const basket: "EIX_B" | "EIX_M" = (idx + i) % 2 === 0 ? "EIX_B" : "EIX_M";
      const commodityType = SYMBOL_TO_COMMODITY[symbol];
      trades.push({
        id: `mock-${idx}-${i}-${Date.now()}`,
        openedAt: d.toISOString(),
        symbol,
        instrument: inst,
        side: profile.direction,
        leverageMultiplier: profile.leverageMultiplier,
        size,
        entryPrice,
        markPrice,
        exposureEur: Math.round(exposureEur),
        pnlEur: Math.round(pnlEur),
        basket,
        commodityType,
        _profile: profile,
      } as OpenTrade & { _profile: FilterProfile });
    }
  });

  return trades;
}

const CACHED_MOCK_TRADES = genMockTrades();

function getBucketsForWindow(window: TimeWindow): { count: number; label: (i: number, base: Date) => string } {
  const base = new Date();
  switch (window) {
    case "1D":
      return {
        count: 16,
        label: (i, b) => `${String(7 + (15 - i)).padStart(2, "0")}:00`,
      };
    case "1W":
      return { count: 7, label: (i) => `Tag ${7 - i}` };
    case "1M":
      return { count: 30, label: (i) => `T${30 - i}` };
    case "3M":
      return { count: 12, label: (i) => `W${12 - i}` };
    case "1Y":
      return { count: 12, label: (i) => `M${12 - i}` };
    case "ALL":
      return { count: 20, label: (i) => `B${20 - i}` };
    default:
      return { count: 24, label: (i) => `T${i}` };
  }
}

function buildTimeline(
  trades: OpenTrade[],
  window: TimeWindow
): { series: ExposurePoint[]; summary: ExposureSummary } {
  const { count, label } = getBucketsForWindow(window);
  const base = new Date();
  const series: ExposurePoint[] = [];
  const currentHour = window === "1D" ? base.getHours() : null;

  let currentLong = 0;
  let currentShort = 0;

  for (let i = count - 1; i >= 0; i--) {
    const bucketIdx = count - 1 - i;
    const bucketHour = window === "1D" ? 7 + bucketIdx : null;
    const isFuture = window === "1D" && bucketHour != null && currentHour != null && bucketHour > currentHour;

    const fraction = (bucketIdx + 0.5) / count;
    const longEur = isFuture
      ? null
      : trades
          .filter((t) => t.side === "LONG")
          .reduce((s, t) => s + Math.round(t.exposureEur * (0.7 + fraction * 0.3)), 0);
    const shortEur = isFuture
      ? null
      : trades
          .filter((t) => t.side === "SHORT")
          .reduce((s, t) => s + Math.round(t.exposureEur * (0.7 + fraction * 0.3)), 0);

    if (!isFuture && longEur != null && shortEur != null) {
      currentLong = longEur;
      currentShort = shortEur;
    }

    series.push({
      t: label(i, base),
      longEur,
      shortEur,
      netEur: longEur != null && shortEur != null ? longEur - shortEur : null,
      grossEur: longEur != null && shortEur != null ? longEur + shortEur : null,
      openTradesCount: trades.length,
    });
  }

  const summary: ExposureSummary = {
    currentLongEur: currentLong,
    currentShortEur: currentShort,
    currentNetEur: currentLong - currentShort,
    currentGrossEur: currentLong + currentShort,
    openTradesCount: trades.length,
  };

  return { series, summary };
}

export const mockAnalyticsAdapter: AnalyticsAdapter = {
  async getExposureTimeline({ überfilter, commodityFilter, window }) {
    let filtered = tradesForÜberfilter(CACHED_MOCK_TRADES, überfilter);
    if (commodityFilter !== "ALL") {
      filtered = tradesForCommodity(filtered, commodityFilter);
    }
    return buildTimeline(filtered, window);
  },

  async searchInstruments(query: string): Promise<InstrumentRef[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_INSTRUMENTS.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.isin && i.isin.toLowerCase().includes(q)) ||
        (i.wkn && i.wkn.includes(q)) ||
        (i.ticker && i.ticker.toLowerCase().includes(q))
    );
  },

  async getInstrumentExposure({ instrument, überfilter, commodityFilter, window }) {
    let filtered = tradesForÜberfilter(CACHED_MOCK_TRADES, überfilter);
    const symbolMatch = instrument.ticker ?? instrument.name.split(" ")[0] ?? "";
    const instTrades = filtered.filter(
      (t) =>
        t.symbol === symbolMatch ||
        t.instrument.isin === instrument.isin ||
        t.instrument.wkn === instrument.wkn ||
        (instrument.ticker && t.instrument.ticker === instrument.ticker)
    );
    const commodityFiltered = commodityFilter !== "ALL" ? tradesForCommodity(instTrades, commodityFilter) : instTrades;
    return buildTimeline(commodityFiltered, window);
  },

  async getOpenTrades({ scope, scopeMap, sortBy }) {
    const filtered = tradesForScope(CACHED_MOCK_TRADES, scope, scopeMap);
    const mapped = filtered.map((t) => {
      const { _profile: _, ...rest } = t as OpenTrade & { _profile: FilterProfile };
      return rest;
    });

    switch (sortBy) {
      case "NEWEST":
        return [...mapped].sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
      case "LARGEST_EXPOSURE":
        return [...mapped].sort((a, b) => b.exposureEur - a.exposureEur);
      case "PNL":
        return [...mapped].sort((a, b) => b.pnlEur - a.pnlEur);
      default:
        return mapped;
    }
  },
};
