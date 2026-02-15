import { mockAdapter } from "./mockAdapter";
import { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";
import { mockSentimentAdapter } from "./mockSentimentAdapter";

export { mockAdapter } from "./mockAdapter";
export { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";
export { mockSentimentAdapter } from "./mockSentimentAdapter";
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
} from "./types";

export const dashboardAdapter = mockAdapter;
export const analyticsAdapter = mockAnalyticsAdapter;
export const sentimentAdapter = mockSentimentAdapter;
