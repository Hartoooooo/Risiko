"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ExposurePoint, ExposureSummary, ExposureÜberfilter, ExposureCommodityFilter, TimeWindow } from "@/lib/adapter/types";
import { analyticsAdapter } from "@/lib/adapter";
import { useInstrumentLookup } from "./InstrumentLookup";
import { Card } from "../ui/Card";

const ÜBERFILTER_OPTIONS: { value: ExposureÜberfilter; label: string }[] = [
  { value: "ALL", label: "Alle" },
  { value: "BER", label: "BER" },
  { value: "MUN", label: "MUN" },
];

const COMMODITY_OPTIONS: { value: ExposureCommodityFilter; label: string }[] = [
  { value: "ALL", label: "Alle" },
  { value: "GOLD", label: "Gold" },
  { value: "SILBER", label: "Silber" },
  { value: "PLATIN", label: "Platin" },
  { value: "KUPFER", label: "Kupfer" },
  { value: "OEL", label: "Öl" },
];

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && (
        <span className="text-xs font-medium text-zinc-500 light:text-zinc-600">{label}</span>
      )}
      <div className="flex rounded border border-zinc-600 bg-zinc-800/50 p-0.5 light:border-zinc-300 light:bg-zinc-100">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`cursor-pointer rounded px-2 py-1 text-xs transition-colors ${
              value === o.value
                ? "bg-amber-500/30 text-amber-400 light:bg-amber-500/20 light:text-amber-600"
                : "text-zinc-400 hover:text-zinc-200 light:text-zinc-600 light:hover:text-zinc-800"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type ExposureTimelineChartProps = {
  instrumentSearchSlot?: React.ReactNode;
};

export function ExposureTimelineChart({ instrumentSearchSlot }: ExposureTimelineChartProps) {
  const { selectedInstrument } = useInstrumentLookup();
  const [überfilter, setÜberfilter] = useState<ExposureÜberfilter>("ALL");
  const [commodityFilter, setCommodityFilter] = useState<ExposureCommodityFilter>("ALL");
  const timeWindow: TimeWindow = "1D";
  const [data, setData] = useState<{ series: ExposurePoint[]; summary: ExposureSummary } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (selectedInstrument) {
      analyticsAdapter
        .getInstrumentExposure({
          instrument: selectedInstrument,
          überfilter,
          commodityFilter,
          window: timeWindow,
        })
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      analyticsAdapter
        .getExposureTimeline({
          überfilter,
          commodityFilter,
          window: timeWindow,
        })
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [überfilter, commodityFilter, timeWindow, selectedInstrument]);

  if (loading && !data) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600">
          Exposure Verlauf (gefiltert)
        </h3>
        <div className="h-[360px] animate-pulse rounded bg-zinc-800/50 light:bg-zinc-200/50" />
      </Card>
    );
  }

  const summary = data?.summary;
  const series = data?.series ?? [];

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600">
        Exposure Verlauf (gefiltert)
      </h3>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <SegmentedControl
          value={überfilter}
          options={ÜBERFILTER_OPTIONS}
          onChange={setÜberfilter}
        />
        <SegmentedControl
          value={commodityFilter}
          options={COMMODITY_OPTIONS}
          onChange={setCommodityFilter}
        />
        {instrumentSearchSlot && <div className="ml-auto">{instrumentSearchSlot}</div>}
      </div>

      {summary && (
        <div className="mb-4 flex flex-wrap gap-6 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 light:border-zinc-200 light:bg-zinc-100/50">
          <div>
            <span className="text-xs text-zinc-500 light:text-zinc-600">Gesamt Exposure</span>
            <div className="text-lg font-bold text-zinc-200 light:text-zinc-800">
              {summary.currentGrossEur.toLocaleString("de-DE")} €
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-500 light:text-zinc-600">Long</span>
            <div className="text-lg font-bold text-emerald-400">
              {summary.currentLongEur.toLocaleString("de-DE")} €
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-500 light:text-zinc-600">Short</span>
            <div className="text-lg font-bold text-red-400">
              {summary.currentShortEur.toLocaleString("de-DE")} €
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-500 light:text-zinc-600">Offene Trades</span>
            <div className="text-lg font-bold text-zinc-200 light:text-zinc-800">
              {summary.openTradesCount}
            </div>
          </div>
        </div>
      )}

      {series.length === 0 ? (
        <div className="flex h-[360px] items-center justify-center rounded border border-dashed border-zinc-600 text-sm text-zinc-500 light:border-zinc-300 light:text-zinc-600">
          Keine offenen Trades für diese Filter
        </div>
      ) : (
        <div className="h-[360px] min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="gradLong" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
              <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v.toLocaleString("de-DE", { maximumFractionDigits: 0 }))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number | undefined) => [value != null ? value.toLocaleString("de-DE") : "", ""]}
                labelStyle={{ color: "#a1a1aa" }}
                labelFormatter={(label) => `Zeit: ${label}`}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => <span className="text-zinc-300 light:text-zinc-600">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="longEur"
                name="Long"
                stroke="#34d399"
                fill="url(#gradLong)"
                strokeWidth={1.5}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="shortEur"
                name="Short"
                stroke="#f87171"
                fill="url(#gradShort)"
                strokeWidth={1.5}
                connectNulls={false}
              />
              <Line type="monotone" dataKey="grossEur" name="Gesamt" stroke="#71717a" strokeWidth={1.5} dot={false} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
