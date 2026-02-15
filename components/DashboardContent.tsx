"use client";

import { PanelFiltersProvider } from "@/lib/context/PanelFiltersContext";
import { FilterablePanel } from "./FilterablePanel";
import { AdvancedAnalyticsSection } from "./analytics/AdvancedAnalyticsSection";

export function DashboardContent() {
  return (
    <PanelFiltersProvider>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <FilterablePanel panelId="A" />
        <FilterablePanel panelId="B" />
        <FilterablePanel panelId="C" />
      </div>
      <AdvancedAnalyticsSection />
    </PanelFiltersProvider>
  );
}
