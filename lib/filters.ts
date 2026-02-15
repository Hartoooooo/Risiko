import type { PanelFilter } from "./adapter/types";

export const DEFAULT_FILTER_A: PanelFilter = {
  assetClass: "Aktie",
  direction: "LONG",
  leverageMode: "OHNE_HEBEL",
  commodityMode: "KEIN_ROHSTOFF",
  leverageMultiplier: null,
  commodityType: null,
};

export const DEFAULT_FILTER_B: PanelFilter = {
  assetClass: "Aktie",
  direction: "LONG",
  leverageMode: "OHNE_HEBEL",
  commodityMode: "KEIN_ROHSTOFF",
  leverageMultiplier: null,
  commodityType: null,
};

export const DEFAULT_FILTER_C: PanelFilter = {
  assetClass: "Aktie",
  direction: "SHORT",
  leverageMode: "OHNE_HEBEL",
  commodityMode: "KEIN_ROHSTOFF",
  leverageMultiplier: null,
  commodityType: null,
};

export const DEFAULT_FILTERS: Record<"A" | "B" | "C", PanelFilter> = {
  A: DEFAULT_FILTER_A,
  B: DEFAULT_FILTER_B,
  C: DEFAULT_FILTER_C,
};

export function buildPanelTitle(filter: PanelFilter): string {
  const parts: string[] = [
    filter.assetClass,
    filter.direction,
    filter.leverageMode === "MIT_HEBEL"
      ? `MIT HEBEL ${filter.leverageMultiplier ?? ""}`
      : "OHNE HEBEL",
    filter.commodityMode,
  ];
  if (filter.commodityMode === "ROHSTOFF" && filter.commodityType) {
    parts.push(filter.commodityType);
  }
  return parts.join(" • ");
}

export function applyFilterReset(
  filter: PanelFilter,
  key: keyof PanelFilter,
  value: string
): PanelFilter {
  const next = { ...filter } as PanelFilter;
  (next as Record<string, unknown>)[key] = value;

  if (key === "assetClass" && value === "Aktie") {
    next.leverageMode = "OHNE_HEBEL";
    next.leverageMultiplier = null;
  }
  if (key === "leverageMode") {
    next.leverageMultiplier = value === "OHNE_HEBEL" ? null : (filter.leverageMultiplier ?? "2x");
  }
  if (key === "commodityMode") {
    next.commodityType = value === "KEIN_ROHSTOFF" ? null : (filter.commodityType ?? "GOLD");
  }

  return next;
}
