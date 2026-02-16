import { mockAdapter } from "./mockAdapter";
import { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";
import { mockSentimentAdapter } from "./mockSentimentAdapter";
import { mockExposureHeatmapAdapter } from "./mockExposureHeatmapAdapter";

export { mockAdapter } from "./mockAdapter";
export { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";
export { mockSentimentAdapter } from "./mockSentimentAdapter";
export { mockExposureHeatmapAdapter } from "./mockExposureHeatmapAdapter";
export type {
  DashboardData,
  DashboardDataAdapter,
  PanelFilter,
  PanelViewModel,
  Trade,
  AnalyticsAdapter,
  FilterScope,
  ExposureMetric,
  ExposureÜberfilter,
  ExposureCommodityFilter,
  TimeWindow,
  InstrumentRef,
  ExposurePoint,
  ExposureSummary,
  OpenTrade,
  SentimentAdapter,
  SentimentGaugeData,
  SentimentKey,
  ExposureHeatmapAdapter,
  ExposureHeatmapData,
  ExposureHeatmapTile,
  HeatmapAssetType,
  NetDirection,
} from "./types";

export const dashboardAdapter = mockAdapter;
export const analyticsAdapter = mockAnalyticsAdapter;
export const sentimentAdapter = mockSentimentAdapter;
export const exposureHeatmapAdapter = mockExposureHeatmapAdapter;
