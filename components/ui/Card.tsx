import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-700/80 bg-zinc-900/60 shadow-lg light:border-zinc-200 light:bg-white light:shadow ${className}`}
    >
      {children}
    </div>
  );
}
