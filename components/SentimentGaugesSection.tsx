"use client";

import { useState, useEffect, useCallback } from "react";
import type { SentimentGaugeData } from "@/lib/adapter/types";
import { SemiGauge } from "./SemiGauge";

type SentimentGaugesSectionProps = {
  gauges: SentimentGaugeData[];
};

const GAUGES_PER_VIEW = 3;

function formatEurFull(value: number): string {
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

function getAccentColor(key: string): string {
  switch (key) {
    case "gold":
      return "border-yellow-500/20";
    case "silver":
      return "border-zinc-400/20";
    case "bitcoin":
      return "border-orange-500/20";
    case "oil":
      return "border-amber-600/20";
    case "platinum":
      return "border-zinc-300/20";
    case "dax":
      return "border-emerald-600/20";
    default:
      return "border-zinc-700";
  }
}

function SentimentCard({ data }: { data: SentimentGaugeData }) {
  const isLongDominant = data.longExposureEur >= data.shortExposureEur;
  
  return (
    <div
      className={`
        rounded-lg border bg-zinc-900/50 p-6 backdrop-blur-sm
        light:bg-white/50 light:border-zinc-200
        ${getAccentColor(data.key)}
      `}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 light:text-zinc-900">
          {data.label}
        </h3>
        <p className="text-xs text-zinc-500 light:text-zinc-600">{data.symbol}</p>
      </div>

      {/* Gauge */}
      <div className="mb-6">
        <SemiGauge
          longPct={data.longPct}
          shortPct={data.shortPct}
          netDirectionLabel={data.netDirectionLabel}
        />
      </div>

      {/* Exposure Details */}
      <div className="space-y-3 border-t border-zinc-800 pt-4 light:border-zinc-200">
        {/* Total Exposure */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 light:text-zinc-600">Exposure gesamt</span>
          <span className="text-sm font-semibold text-zinc-100 light:text-zinc-900">
            {formatEurFull(data.totalExposureEur)}
          </span>
        </div>

        {/* Long / Short Split */}
        <div className="flex gap-2">
          <div className={`flex-1 rounded px-3 py-2 text-center ${
            isLongDominant ? "bg-emerald-500/50" : "bg-emerald-500/10"
          }`}>
            <div className="text-xs font-medium uppercase text-emerald-400">Long</div>
            <div className="text-sm font-semibold text-zinc-100 light:text-zinc-900">
              {formatEurFull(data.longExposureEur)}
            </div>
          </div>
          <div className={`flex-1 rounded px-3 py-2 text-center ${
            !isLongDominant ? "bg-red-500/60" : "bg-red-500/10"
          }`}>
            <div className="text-xs font-medium uppercase text-red-400">Short</div>
            <div className="text-sm font-semibold text-zinc-100 light:text-zinc-900">
              {formatEurFull(data.shortExposureEur)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SentimentGaugesSection({ gauges }: SentimentGaugesSectionProps) {
  const maxPage = Math.max(0, Math.ceil(gauges.length / GAUGES_PER_VIEW) - 1);
  const [page, setPage] = useState(0);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(maxPage, p + 1));
  }, [maxPage]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const visibleGauges = gauges.slice(
    page * GAUGES_PER_VIEW,
    page * GAUGES_PER_VIEW + GAUGES_PER_VIEW
  );

  return (
    <section className="relative px-4 pt-4">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-0 right-0 z-10 flex -translate-y-1/2 justify-between px-0 md:px-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={page === 0}
          className="rounded-full bg-zinc-800/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-30 disabled:hover:bg-zinc-800/80 disabled:hover:text-zinc-400"
          aria-label="Vorherige Gauges"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={page >= maxPage}
          className="rounded-full bg-zinc-800/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-30 disabled:hover:bg-zinc-800/80 disabled:hover:text-zinc-400"
          aria-label="Nächste Gauges"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleGauges.map((gauge) => (
            <SentimentCard key={gauge.key} data={gauge} />
          ))}
        </div>
      </div>

      {/* Page Dots (wenn mehr als 1 Seite) */}
      {maxPage > 0 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === page ? "bg-zinc-400" : "bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Seite ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
