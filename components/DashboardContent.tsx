"use client";

import { PanelFiltersProvider } from "@/lib/context/PanelFiltersContext";
import { FilterablePanel } from "./FilterablePanel";
import { AdvancedAnalyticsSection } from "./analytics/AdvancedAnalyticsSection";
import { SentimentGaugesSection } from "./SentimentGaugesSection";
import type { SentimentGaugeData } from "@/lib/adapter/types";

type DashboardContentProps = {
  sentimentGauges: SentimentGaugeData[];
};

export function DashboardContent({ sentimentGauges }: DashboardContentProps) {
  return (
    <PanelFiltersProvider>
      <SentimentGaugesSection gauges={sentimentGauges} />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <FilterablePanel panelId="A" />
        <FilterablePanel panelId="B" />
        <FilterablePanel panelId="C" />
      </div>
      <AdvancedAnalyticsSection />
    </PanelFiltersProvider>
  );
}
