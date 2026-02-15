import type { PositionSplit } from "@/lib/adapter/types";

type PositionSplitCardProps = {
  positions: PositionSplit;
};

export function PositionSplitCard({ positions }: PositionSplitCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500 light:text-zinc-600">
        Exposure
      </h4>
      <div className="flex h-2 w-full overflow-hidden rounded bg-zinc-800 light:bg-zinc-200">
        <div
          className="bg-emerald-500/70 transition-all"
          style={{ width: `${positions.longPct}%` }}
        />
        <div
          className="bg-red-500/70 transition-all"
          style={{ width: `${positions.shortPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <div>
          <span className="text-zinc-500 light:text-zinc-600">Long </span>
          <span className="font-medium text-emerald-400">
            {positions.longPct}% · {positions.longEur.toLocaleString("de-DE")} €
          </span>
        </div>
        <div>
          <span className="text-zinc-500 light:text-zinc-600">Short </span>
          <span className="font-medium text-red-400">
            {positions.shortPct}% · {positions.shortEur.toLocaleString("de-DE")} €
          </span>
        </div>
      </div>
    </div>
  );
}
