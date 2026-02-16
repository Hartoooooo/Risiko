"use client";

import type { ExposureHeatmapTile as TileType } from "@/lib/adapter/types";

type ExposureHeatmapTileProps = {
  tile: TileType;
  maxAbsTotalExposureEur: number;
  onTileClick?: (tile: TileType) => void;
};

function formatEurCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K €`;
  }
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

export function ExposureHeatmapTile({
  tile,
  maxAbsTotalExposureEur,
  onTileClick,
}: ExposureHeatmapTileProps) {
  const absTotal = Math.abs(tile.totalExposureEur);
  const normalizedIntensity = maxAbsTotalExposureEur > 0 ? absTotal / maxAbsTotalExposureEur : 0;
  const opacity = Math.min(0.65, 0.2 + normalizedIntensity * 0.45);

  const isLong = tile.netDirection === "NET_LONG";
  const isShort = tile.netDirection === "NET_SHORT";
  const isNeutral = tile.netDirection === "NEUTRAL";

  const bgColor = isNeutral
    ? `rgba(113, 113, 122, ${opacity})` // zinc
    : isLong
      ? `rgba(34, 197, 94, ${opacity})` // emerald-500
      : `rgba(239, 68, 68, ${opacity})`; // red-500

  return (
    <button
      type="button"
      onClick={() => onTileClick?.(tile)}
      className={`
        flex min-h-[100px] flex-col rounded-lg border border-zinc-700/60 p-3 text-left
        transition-all hover:border-zinc-500 hover:shadow-lg hover:shadow-zinc-900/50
        light:border-zinc-200 light:hover:shadow-zinc-200/50
      `}
      style={{ backgroundColor: bgColor }}
    >
      {/* Row1: Label | Gesamt Exposure */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-100 light:text-zinc-900">
            {tile.label}
          </div>
        </div>
        <span className="shrink-0 text-right text-sm font-bold text-zinc-100 light:text-zinc-900">
          {formatEurCompact(tile.totalExposureEur)}
        </span>
      </div>

      {/* Row3: L / S chips */}
      <div className="mt-auto flex gap-2">
        <div className="flex-1 rounded bg-emerald-500/40 px-2 py-1 text-center">
          <span className="text-[10px] font-medium text-emerald-300 light:text-emerald-700">L</span>
          <div className="text-xs font-semibold text-zinc-100 light:text-zinc-900">
            {formatEurCompact(tile.longExposureEur)}
          </div>
        </div>
        <div className="flex-1 rounded bg-red-500/40 px-2 py-1 text-center">
          <span className="text-[10px] font-medium text-red-300 light:text-red-700">S</span>
          <div className="text-xs font-semibold text-zinc-100 light:text-zinc-900">
            {formatEurCompact(tile.shortExposureEur)}
          </div>
        </div>
      </div>
    </button>
  );
}
