"use client";

import { useState } from "react";
import type { Trade } from "@/lib/adapter/types";
import { Badge } from "./ui/Badge";

type RecentTradesCardProps = {
  trades: Trade[];
};

type ColumnMode = "pnl" | "vol";
type SortBy = "pnl" | "vol";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "pnl", label: "nach P/L" },
  { value: "vol", label: "nach Vol" },
];

const COLUMN_OPTIONS: { value: ColumnMode; label: string }[] = [
  { value: "pnl", label: "PnL" },
  { value: "vol", label: "Vol." },
];

function ToggleButton<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const currentIdx = options.findIndex((o) => o.value === value);
  const nextValue = options[(currentIdx + 1) % options.length]!.value;
  const label = options.find((o) => o.value === value)?.label ?? value;

  return (
    <button
      type="button"
      onClick={(e) => {
        onChange(nextValue);
        (e.currentTarget as HTMLButtonElement).blur();
      }}
      className="cursor-pointer rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-left text-xs text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 light:border-zinc-300 light:bg-white light:text-zinc-800"
    >
      {label}
    </button>
  );
}

export function RecentTradesCard({ trades }: RecentTradesCardProps) {
  const [sortBy, setSortBy] = useState<SortBy>("vol");
  const [columnMode, setColumnMode] = useState<ColumnMode>("vol");

  const sortedTrades = [...trades].sort((a, b) => {
    if (sortBy === "vol") {
      return (b.price * b.size) - (a.price * a.size);
    }
    const aPnl = a.pnlEurUnreal ?? 0;
    const bPnl = b.pnlEurUnreal ?? 0;
    return bPnl - aPnl;
  });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500 light:text-zinc-600">
          Offene Trades
        </h4>
        <div className="flex items-center gap-2">
          <ToggleButton value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
          <ToggleButton value={columnMode} options={COLUMN_OPTIONS} onChange={setColumnMode} />
        </div>
      </div>
      <div className="space-y-1">
        {sortedTrades.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 border-b border-zinc-700/40 py-1.5 text-xs last:border-0 light:border-zinc-200"
          >
            <span className="text-zinc-500 light:text-zinc-600 w-10 shrink-0">{t.ts}</span>
            <span className="truncate flex-1 min-w-0 text-zinc-400 light:text-zinc-600">
              {t.symbol} <span className="text-zinc-500 light:text-zinc-500">{t.size}×</span>
            </span>
            <span className="w-14 shrink-0">
              <Badge variant={t.side === "LONG" ? "long" : "short"}>{t.side}</Badge>
            </span>
            <span className="text-zinc-400 light:text-zinc-600 w-16 shrink-0 text-right">
              {t.price >= 1000 ? t.price.toLocaleString("de-DE", { minimumFractionDigits: 2 }) : t.price.toFixed(2)}
            </span>
            <span className="min-w-[4.5rem] text-right">
              {columnMode === "pnl" && t.pnlEurUnreal != null ? (
                <span
                  className={`font-medium ${
                    t.pnlEurUnreal >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  unr. {t.pnlEurUnreal >= 0 ? "+" : ""}
                  {t.pnlEurUnreal.toLocaleString("de-DE")} €
                </span>
              ) : columnMode === "vol" ? (
                <span className="text-zinc-400 light:text-zinc-600">
                  {(t.price * t.size).toLocaleString("de-DE", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  €
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
