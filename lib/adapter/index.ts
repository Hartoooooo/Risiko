import { mockAdapter } from "./mockAdapter";
import { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";

export { mockAdapter } from "./mockAdapter";
export { mockAnalyticsAdapter } from "./mockAnalyticsAdapter";
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
} from "./types";

export const dashboardAdapter = mockAdapter;
export const analyticsAdapter = mockAnalyticsAdapter;
