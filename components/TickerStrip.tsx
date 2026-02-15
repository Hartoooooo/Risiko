"use client";

import type { TickerItem } from "@/lib/adapter/types";

type TickerStripProps = {
  tickers: TickerItem[];
};

function TickerItem({ t }: { t: TickerItem }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-md border border-zinc-600/50 bg-zinc-800/50 px-3 py-1.5 light:border-zinc-300 light:bg-white">
      <span className="text-xs font-medium text-zinc-400 light:text-zinc-600">{t.label}</span>
      <span className="text-sm font-semibold text-zinc-100 light:text-zinc-900">
        {t.price >= 1000
          ? t.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })
          : t.price.toFixed(2)}
      </span>
      <span
        className={`text-xs font-medium ${
          t.changePct >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {t.changePct >= 0 ? "+" : ""}
        {t.changePct.toFixed(2)}%
      </span>
    </div>
  );
}

export function TickerStrip({ tickers }: TickerStripProps) {
  return (
    <div className="relative overflow-hidden border-b border-zinc-700/60 bg-zinc-950/80 py-2 light:border-zinc-200 light:bg-zinc-50">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          flex-wrap: nowrap;
          width: max-content;
          animation: ticker-scroll 90s linear infinite;
        }
      `}</style>
      <div className="ticker-track gap-4 px-4">
        {[...tickers, ...tickers].map((t, i) => (
          <TickerItem key={`${t.key}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
