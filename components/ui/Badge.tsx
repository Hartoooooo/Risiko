import { type ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "long" | "short" | "neutral";
  className?: string;
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variantStyles = {
    long: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    short: "bg-red-500/20 text-red-400 border-red-500/40",
    neutral: "bg-zinc-600/30 text-zinc-300 border-zinc-500/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
