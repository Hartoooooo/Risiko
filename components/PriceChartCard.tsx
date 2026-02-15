"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartPoint } from "@/lib/adapter/types";

type PriceChartCardProps = {
  symbol: string;
  price: number;
  changePct: number;
  timeframeLabel: string;
  chart: ChartPoint[];
  accentColor?: string;
};

export function PriceChartCard({
  symbol,
  price,
  changePct,
  timeframeLabel,
  chart,
  accentColor = "emerald",
}: PriceChartCardProps) {
  const colorMap: Record<string, { stroke: string }> = {
    amber: { stroke: "#f59e0b" },
    zinc: { stroke: "#a1a1aa" },
    orange: { stroke: "#f97316" },
    emerald: { stroke: "#34d399" },
  };
  const { stroke } = colorMap[accentColor] ?? colorMap.emerald;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-200 light:text-zinc-800">{symbol}</span>
          <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px] text-zinc-400 light:bg-zinc-200 light:text-zinc-600">
            {timeframeLabel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-zinc-100 light:text-zinc-900">
            {price >= 1000 ? price.toLocaleString("de-DE", { minimumFractionDigits: 2 }) : price.toFixed(2)}
          </span>
          <span
            className={`ml-2 text-xs font-medium ${
              changePct >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {changePct >= 0 ? "+" : ""}
            {changePct.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="h-[100px] min-h-[100px] min-w-0 w-full">
        <ResponsiveContainer width="100%" height={100} initialDimension={{ width: 400, height: 100 }}>
          <AreaChart data={chart} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              hide
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: "6px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number | undefined) => [value != null ? value.toFixed(2) : "", ""]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              strokeWidth={1.5}
              fill={`url(#grad-${symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
