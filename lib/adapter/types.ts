export type AssetClass = "Aktie" | "ETP";
export type Direction = "LONG" | "SHORT";
export type LeverageMode = "OHNE_HEBEL" | "MIT_HEBEL";
export type CommodityMode = "KEIN_ROHSTOFF" | "ROHSTOFF";
export type LeverageMultiplier = "2x" | "3x" | "4x" | "5x";
export type CommodityType = "GOLD" | "SILBER" | "PLATIN" | "KUPFER" | "OEL";

export type PanelFilter = {
  assetClass: AssetClass;
  direction: Direction;
  leverageMode: LeverageMode;
  commodityMode: CommodityMode;
  leverageMultiplier: LeverageMultiplier | null;
  commodityType: CommodityType | null;
};

export type ChartPoint = {
  t: string;
  v: number;
};

export type PositionSplit = {
  longPct: number;
  shortPct: number;
  longEur: number;
  shortEur: number;
};

export type Trade = {
  id: string;
  ts: string;
  symbol: string;
  side: "LONG" | "SHORT";
  size: number;
  price: number;
  pnlEur?: number;
  pnlEurUnreal?: number;
};

export type PanelViewModel = {
  id: "A" | "B" | "C";
  filter: PanelFilter;
  title: string;
  symbolLabel: string;
  price: number;
  changePct: number;
  chartHidden: boolean;
  chart: ChartPoint[];
  positions: PositionSplit;
  trades: Trade[];
};

export type TickerItem = {
  key: string;
  label: string;
  price: number;
  changePct: number;
};

export type DashboardData = {
  headerTitle: string;
  nodeLabel: string;
  tickers: TickerItem[];
};

export interface DashboardDataAdapter {
  getPanelData(panelId: "A" | "B" | "C", filter: PanelFilter): Promise<PanelViewModel>;
  getHeaderData(): Promise<DashboardData>;
}

// Advanced Analytics Types
export type FilterScope = "PANEL_A" | "PANEL_B" | "PANEL_C" | "ALL_PANELS_UNION";

/** Überfilter für Exposure: Alle = alle offenen Trades, BER = Basket EIX B, MUN = Basket EIX M */
export type ExposureÜberfilter = "ALL" | "BER" | "MUN";

/** Rohstoff-Filter: nur Long-Exposure des jeweiligen Rohstoffs */
export type ExposureCommodityFilter = "ALL" | "GOLD" | "SILBER" | "PLATIN" | "KUPFER" | "OEL";
export type ExposureMetric = "NET" | "GROSS" | "LONG_SHORT_SPLIT";
export type TimeWindow = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export type InstrumentRef = {
  name: string;
  isin?: string | null;
  wkn?: string | null;
  ticker?: string | null;
  exchange?: string | null;
};

export type ExposurePoint = {
  t: string;
  longEur: number | null;
  shortEur: number | null;
  netEur: number | null;
  grossEur: number | null;
  openTradesCount: number;
};

export type ExposureSummary = {
  currentLongEur: number;
  currentShortEur: number;
  currentNetEur: number;
  currentGrossEur: number;
  openTradesCount: number;
};

export type OpenTrade = {
  id: string;
  openedAt: string;
  symbol: string;
  instrument: InstrumentRef;
  side: "LONG" | "SHORT";
  leverageMultiplier: "2x" | "3x" | "4x" | "5x" | null;
  size: number;
  entryPrice: number;
  markPrice: number;
  exposureEur: number;
  pnlEur: number;
  /** Basket/Überfilter: EIX_B = Berlin, EIX_M = München */
  basket?: "EIX_B" | "EIX_M";
  /** Rohstoff-Kategorie für Filter */
  commodityType?: "GOLD" | "SILBER" | "PLATIN" | "KUPFER" | "OEL";
};

export interface AnalyticsAdapter {
  getExposureTimeline(args: {
    überfilter: ExposureÜberfilter;
    commodityFilter: ExposureCommodityFilter;
    window: TimeWindow;
  }): Promise<{ series: ExposurePoint[]; summary: ExposureSummary }>;

  searchInstruments(query: string): Promise<InstrumentRef[]>;

  getInstrumentExposure(args: {
    instrument: InstrumentRef;
    überfilter: ExposureÜberfilter;
    commodityFilter: ExposureCommodityFilter;
    window: TimeWindow;
  }): Promise<{ series: ExposurePoint[]; summary: ExposureSummary }>;

  getOpenTrades(args: {
    scope: FilterScope;
    scopeMap: { A: PanelFilter; B: PanelFilter; C: PanelFilter };
    sortBy: "NEWEST" | "LARGEST_EXPOSURE" | "PNL";
  }): Promise<OpenTrade[]>;
}

// Sentiment Gauges Types
export type SentimentKey = "gold" | "silver" | "bitcoin";

export type SentimentGaugeData = {
  key: SentimentKey;
  label: string; // z.B. "GOLD SENTIMENT"
  symbol: string; // z.B. "GC=F"
  longPct: number; // 0..100
  shortPct: number; // 0..100 (sollte 100-longPct sein)
  longExposureEur: number; // Summe Notional Long
  shortExposureEur: number; // Summe Notional Short
  totalExposureEur: number; // long + short
  netDirectionLabel: "NET LONG" | "NET SHORT" | "NEUTRAL";
};

export interface SentimentAdapter {
  // Liefert die 3 festen Gauges (Gold/Silber/Bitcoin). Später DB/API.
  getSentimentGauges(): Promise<SentimentGaugeData[]>;
}
