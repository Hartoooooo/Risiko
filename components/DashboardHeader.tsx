"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

type DashboardHeaderProps = {
  title: string;
};

const UEBERFILTER_OPTIONS = ["Alle", "BER", "MUN"] as const;
type UberfilterValue = (typeof UEBERFILTER_OPTIONS)[number];

const LOADING_DURATION_MS = 750;

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const [uberfilter, setUberfilter] = useState<UberfilterValue>("Alle");
  const [loading, setLoading] = useState(false);

  const handleUberfilterChange = (opt: UberfilterValue) => {
    if (opt === uberfilter) return;
    setLoading(true);
    setUberfilter(opt);
  };

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <header className="grid grid-cols-3 items-center gap-4 px-4 py-3 border-b border-zinc-700/50 bg-zinc-900/40 dark:border-zinc-700/50 dark:bg-zinc-900/40 light:border-zinc-200 light:bg-zinc-100">
      <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded border border-zinc-600 light:border-zinc-300 p-0.5">
            {UEBERFILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleUberfilterChange(opt)}
                disabled={loading}
                className={`cursor-pointer rounded px-2 py-0.5 text-xs transition-colors focus:outline-none focus:ring-0 disabled:cursor-default disabled:opacity-60 ${
                  uberfilter === opt
                    ? "bg-amber-500/30 text-amber-400 light:bg-amber-500/40 light:text-amber-600"
                    : "text-zinc-400 hover:text-zinc-300 light:text-zinc-600 light:hover:text-zinc-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-amber-400 light:border-zinc-400 light:border-t-amber-500" aria-hidden />
          )}
        </div>
      <h1 className="text-center text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-900">
        {title}
      </h1>
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
