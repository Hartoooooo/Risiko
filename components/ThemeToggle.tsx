"use client";

import { useTheme } from "./ThemeProvider";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
    <path d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={theme === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus:ring-0 dark:border-zinc-600 dark:bg-zinc-800 light:border-zinc-300 light:bg-zinc-200"
    >
      <span
        className={`pointer-events-none inline-flex h-3.5 w-3.5 transform items-center justify-center rounded-full shadow transition duration-200 ${
          theme === "dark"
            ? "translate-x-5 bg-amber-400 text-zinc-900"
            : "translate-x-0.5 bg-zinc-500 text-zinc-100 light:bg-zinc-600 light:text-zinc-100"
        }`}
      >
        {theme === "dark" ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}
