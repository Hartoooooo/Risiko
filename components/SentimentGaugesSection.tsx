import type { SentimentGaugeData } from "@/lib/adapter/types";
import { SemiGauge } from "./SemiGauge";

type SentimentGaugesSectionProps = {
  gauges: SentimentGaugeData[];
};

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
  return (
    <section className="px-4 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gauges.map((gauge) => (
          <SentimentCard key={gauge.key} data={gauge} />
        ))}
      </div>
    </section>
  );
}
