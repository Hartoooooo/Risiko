"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PanelFilter } from "@/lib/adapter/types";
import { DEFAULT_FILTERS } from "@/lib/filters";

type ScopeMap = { A: PanelFilter; B: PanelFilter; C: PanelFilter };

type PanelFiltersContextValue = {
  scopeMap: ScopeMap;
  setFilter: (panelId: "A" | "B" | "C", filter: PanelFilter) => void;
};

const PanelFiltersContext = createContext<PanelFiltersContextValue | null>(null);

export function PanelFiltersProvider({ children }: { children: ReactNode }) {
  const [scopeMap, setScopeMap] = useState<ScopeMap>({
    A: DEFAULT_FILTERS.A,
    B: DEFAULT_FILTERS.B,
    C: DEFAULT_FILTERS.C,
  });

  const setFilter = useCallback((panelId: "A" | "B" | "C", filter: PanelFilter) => {
    setScopeMap((prev) => ({ ...prev, [panelId]: filter }));
  }, []);

  return (
    <PanelFiltersContext.Provider value={{ scopeMap, setFilter }}>
      {children}
    </PanelFiltersContext.Provider>
  );
}

export function usePanelFilters(): PanelFiltersContextValue {
  const ctx = useContext(PanelFiltersContext);
  if (!ctx) {
    throw new Error("usePanelFilters must be used within PanelFiltersProvider");
  }
  return ctx;
}

export function usePanelFiltersOptional(): PanelFiltersContextValue | null {
  return useContext(PanelFiltersContext);
}
