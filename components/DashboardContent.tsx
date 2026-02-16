"use client";

import { PanelFiltersProvider } from "@/lib/context/PanelFiltersContext";
import { FilterablePanel } from "./FilterablePanel";
import { AdvancedAnalyticsSection } from "./analytics/AdvancedAnalyticsSection";
import { SentimentGaugesSection } from "./SentimentGaugesSection";
import { ExposureHeatmapSection } from "./ExposureHeatmapSection";
import type { SentimentGaugeData, ExposureHeatmapData } from "@/lib/adapter/types";

type DashboardContentProps = {
  sentimentGauges: SentimentGaugeData[];
  exposureHeatmap: ExposureHeatmapData;
};

export function DashboardContent({ sentimentGauges, exposureHeatmap }: DashboardContentProps) {
  return (
    <PanelFiltersProvider>
      <SentimentGaugesSection gauges={sentimentGauges} />
      <ExposureHeatmapSection data={exposureHeatmap} />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <FilterablePanel panelId="A" />
        <FilterablePanel panelId="B" />
        <FilterablePanel panelId="C" />
      </div>
      <AdvancedAnalyticsSection />
    </PanelFiltersProvider>
  );
}
