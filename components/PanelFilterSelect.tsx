"use client";

import { useState, useRef, useEffect } from "react";
import type { PanelFilter, AssetClass, Direction, LeverageMode, CommodityMode, LeverageMultiplier, CommodityType } from "@/lib/adapter/types";
import { applyFilterReset } from "@/lib/filters";

type PanelFilterSelectProps = {
  filter: PanelFilter;
  onChange: (filter: PanelFilter) => void;
};

const OPTIONS = {
  assetClass: ["Aktie", "ETP"] as AssetClass[],
  direction: ["LONG", "SHORT"] as Direction[],
  leverageMode: ["OHNE_HEBEL", "MIT_HEBEL"] as LeverageMode[],
  commodityMode: ["KEIN_ROHSTOFF", "ROHSTOFF"] as CommodityMode[],
  leverageMultiplier: ["2x", "3x", "4x", "5x"] as LeverageMultiplier[],
  commodityType: ["GOLD", "SILBER", "PLATIN", "KUPFER", "OEL"] as CommodityType[],
};

const LABELS: Record<string, string> = {
  Aktie: "Aktie",
  ETP: "ETP",
  LONG: "Long",
  SHORT: "Short",
  OHNE_HEBEL: "Ohne Hebel",
  MIT_HEBEL: "Mit Hebel",
  KEIN_ROHSTOFF: "Kein Rohstoff",
  ROHSTOFF: "Rohstoff",
  "2x": "2x",
  "3x": "3x",
  "4x": "4x",
  "5x": "5x",
  GOLD: "Gold",
  SILBER: "Silber",
  PLATIN: "Platin",
  KUPFER: "Kupfer",
  OEL: "Öl",
};

export function PanelFilterSelect({ filter, onChange }: PanelFilterSelectProps) {
  const showLeverageFilters = filter.assetClass !== "Aktie";
  const showLeverageMultiplier = showLeverageFilters && filter.leverageMode === "MIT_HEBEL";
  const showCommodityType = filter.commodityMode === "ROHSTOFF";

  const handleChange = (key: keyof PanelFilter, value: string) => {
    onChange(applyFilterReset(filter, key, value));
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      <Dropdown
        value={filter.assetClass}
        options={OPTIONS.assetClass}
        onChange={(v) => handleChange("assetClass", v)}
      />
      <Dropdown
        value={filter.direction}
        options={OPTIONS.direction}
        onChange={(v) => handleChange("direction", v)}
      />
      {showLeverageFilters && (
        <Dropdown
          value={filter.leverageMode}
          options={OPTIONS.leverageMode}
          onChange={(v) => handleChange("leverageMode", v)}
        />
      )}
      <Dropdown
        value={filter.commodityMode}
        options={OPTIONS.commodityMode}
        onChange={(v) => handleChange("commodityMode", v)}
      />
      {showLeverageMultiplier && (
        <Dropdown
          value={filter.leverageMultiplier ?? "2x"}
          options={OPTIONS.leverageMultiplier}
          onChange={(v) => handleChange("leverageMultiplier", v)}
        />
      )}
      {showCommodityType && (
        <Dropdown
          value={filter.commodityType ?? "GOLD"}
          options={OPTIONS.commodityType}
          onChange={(v) => handleChange("commodityType", v)}
        />
      )}
    </div>
  );
}

function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-left text-xs text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 light:border-zinc-300 light:bg-white light:text-zinc-800"
      >
        {LABELS[value] ?? value}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 min-w-full rounded border border-zinc-600 bg-zinc-800 py-0.5 shadow-lg light:border-zinc-300 light:bg-white">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`block w-full cursor-pointer px-2 py-1 text-left text-xs hover:bg-zinc-700 light:hover:bg-zinc-100 ${
                o === value ? "bg-zinc-700/50 text-zinc-100 light:bg-zinc-100 light:text-zinc-900" : "text-zinc-300 light:text-zinc-600"
              }`}
            >
              {LABELS[o] ?? o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
