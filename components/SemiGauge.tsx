"use client";

import { useState, useEffect } from "react";

type SemiGaugeProps = {
  longPct: number; // 0-100
  shortPct: number; // 0-100
  netDirectionLabel: string; // z.B. "NET LONG"
};

export function SemiGauge({
  longPct,
  shortPct,
  netDirectionLabel,
}: SemiGaugeProps) {
  // Animation beim Erstladen: von 0 auf Zielwert (wie Recharts Area-Chart)
  const [displayLong, setDisplayLong] = useState(0);
  const [displayShort, setDisplayShort] = useState(0);

  useEffect(() => {
    setDisplayLong(longPct);
    setDisplayShort(shortPct);
  }, [longPct, shortPct]);

  // Zeige immer den dominanten Wert in der Mitte
  const isDominantLong = longPct >= shortPct;
  const dominantPct = isDominantLong ? longPct : shortPct;
  const dominantLabel = isDominantLong ? "L" : "S";
  const centerLabel = `${dominantPct}% ${dominantLabel}`;

  const dominantColor = isDominantLong ? "text-emerald-400" : "text-red-400";
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Halbkreis: von 180° (links) bis 0° (rechts)
  // shortPct links (rot), longPct rechts (grün)
  
  // Gesamtumfang für Halbkreis
  const circumference = Math.PI * radius;

  // Short-Segment (von links startend) – animierte Anzeige
  const shortLength = (displayShort / 100) * circumference;
  // Long-Segment (der Rest) – animierte Anzeige
  const longLength = (displayLong / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="overflow-visible"
      >
        {/* Background arc (grau) */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-zinc-800 light:text-zinc-300"
        />

        {/* Short segment (rot, links) */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${shortLength} ${circumference}`}
          className="text-red-500"
          style={{
            transition: "stroke-dasharray 0.4s ease-out",
          }}
        />

        {/* Long segment (grün, rechts) */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${longLength} ${circumference}`}
          strokeDashoffset={-shortLength}
          className="text-emerald-500"
          style={{
            transition: "stroke-dasharray 0.4s ease-out, stroke-dashoffset 0.4s ease-out",
          }}
        />
      </svg>

      {/* Center label */}
      <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -20px)" }}>
        <div className="text-center">
          <div className={`text-2xl font-bold ${dominantColor}`}>
            {centerLabel}
          </div>
          <div className={`text-xs font-medium uppercase tracking-wider mt-1 ${
            netDirectionLabel === "NET LONG" 
              ? "text-emerald-400" 
              : netDirectionLabel === "NET SHORT" 
              ? "text-red-400" 
              : "text-zinc-500"
          }`}>
            {netDirectionLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
