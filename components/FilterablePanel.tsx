"use client";

import { useState, useEffect, useCallback } from "react";
import type { PanelFilter, PanelViewModel } from "@/lib/adapter/types";
import { dashboardAdapter } from "@/lib/adapter";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { usePanelFiltersOptional } from "@/lib/context/PanelFiltersContext";
import { Card } from "./ui/Card";
import { PanelFilterSelect } from "./PanelFilterSelect";
import { PriceChartCard } from "./PriceChartCard";
import { PositionSplitCard } from "./PositionSplitCard";
import { RecentTradesCard } from "./RecentTradesCard";

const ACCENT_BY_PANEL: Record<string, string> = {
  A: "amber",
  B: "zinc",
  C: "orange",
};

type FilterablePanelProps = {
  panelId: "A" | "B" | "C";
};

export function FilterablePanel({ panelId }: FilterablePanelProps) {
  const filtersContext = usePanelFiltersOptional();
  const [localFilter, setLocalFilter] = useState<PanelFilter>(() => DEFAULT_FILTERS[panelId]);

  const filter = filtersContext ? filtersContext.scopeMap[panelId] : localFilter;
  const setFilter = filtersContext
    ? (f: PanelFilter) => filtersContext.setFilter(panelId, f)
    : setLocalFilter;

  const [data, setData] = useState<PanelViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dashboardAdapter.getPanelData(panelId, filter);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [panelId, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const accent = ACCENT_BY_PANEL[panelId] ?? "zinc";

  return (
    <Card className="overflow-hidden">
      <div
        className={`h-0.5 w-full ${
          accent === "amber"
            ? "bg-amber-500/80"
            : accent === "orange"
              ? "bg-orange-500/80"
              : "bg-zinc-500/80"
        }`}
      />
      <div className="space-y-4 p-4">
        <PanelFilterSelect filter={filter} onChange={setFilter} />

        {loading && !data ? (
          <div className="py-8 text-center text-sm text-zinc-500 light:text-zinc-600">Laden…</div>
        ) : data ? (
          <>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg ${
                  accent === "amber"
                    ? "text-amber-400"
                    : accent === "orange"
                      ? "text-orange-400"
                      : "text-zinc-300"
                }`}
              >
                ●
              </span>
              <span className="text-sm font-medium text-zinc-300 light:text-zinc-700">{data.symbolLabel}</span>
            </div>

            {!data.chartHidden ? (
              <PriceChartCard
                symbol={data.symbolLabel}
                price={data.price}
                changePct={data.changePct}
                timeframeLabel="4H TICK"
                chart={data.chart}
                accentColor={accent}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-200 light:text-zinc-800">{data.symbolLabel}</span>
                  <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px] text-zinc-400 light:bg-zinc-200 light:text-zinc-600">4H TICK</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-zinc-100 light:text-zinc-900">
                    {data.price >= 1000
                      ? data.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })
                      : data.price.toFixed(2)}
                  </span>
                  <span
                    className={`ml-2 text-xs font-medium ${
                      data.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {data.changePct >= 0 ? "+" : ""}
                    {data.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}

            <PositionSplitCard positions={data.positions} />
            <RecentTradesCard trades={data.trades} />
          </>
        ) : null}
      </div>
    </Card>
  );
}
