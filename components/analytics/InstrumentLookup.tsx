"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext, type ReactNode } from "react";
import type { InstrumentRef } from "@/lib/adapter/types";
import { analyticsAdapter } from "@/lib/adapter";

function formatInstrument(inst: InstrumentRef): string {
  const parts = [inst.name];
  if (inst.ticker) parts.push(`(${inst.ticker})`);
  if (inst.isin) parts.push(inst.isin);
  if (inst.wkn) parts.push(`WKN: ${inst.wkn}`);
  return parts.join(" • ");
}

type InstrumentLookupContextValue = {
  query: string;
  setQuery: (q: string) => void;
  selectedInstrument: InstrumentRef | null;
  setSelectedInstrument: (inst: InstrumentRef | null) => void;
  handleClear: () => void;
};

const InstrumentLookupContext = createContext<InstrumentLookupContextValue | null>(null);

export function useInstrumentLookup() {
  const ctx = useContext(InstrumentLookupContext);
  if (!ctx) throw new Error("Must be used within InstrumentLookupProvider");
  return ctx;
}

export function InstrumentLookupProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentRef | null>(null);

  const handleClear = useCallback(() => {
    setSelectedInstrument(null);
    setQuery("");
  }, []);

  return (
    <InstrumentLookupContext.Provider
      value={{ query, setQuery, selectedInstrument, setSelectedInstrument, handleClear }}
    >
      {children}
    </InstrumentLookupContext.Provider>
  );
}

function SearchInputInner() {
  const { query, setQuery, selectedInstrument, setSelectedInstrument, handleClear } = useInstrumentLookup();
  const [suggestions, setSuggestions] = useState<InstrumentRef[]>([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback((q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setSuggestionOpen(false);
      return;
    }
    analyticsAdapter.searchInstruments(q).then((results) => {
      setSuggestions(results);
      setSuggestionOpen(results.length > 0);
    });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setSuggestionOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (inst: InstrumentRef) => {
    setSelectedInstrument(inst);
    setQuery(formatInstrument(inst));
    setSuggestionOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full min-w-[180px] max-w-[320px]">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          if (!v.trim()) handleClear();
        }}
        onFocus={() => suggestions.length > 0 && setSuggestionOpen(true)}
        placeholder="ISIN / WKN / Ticker"
        className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 light:border-zinc-300 light:bg-white light:text-zinc-800 light:placeholder-zinc-400"
      />
      {suggestionOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-auto rounded border border-zinc-600 bg-zinc-800 py-1 shadow-lg light:border-zinc-300 light:bg-white">
          {suggestions.map((inst) => (
            <button
              key={inst.isin ?? inst.ticker ?? inst.name}
              type="button"
              onClick={() => handleSelect(inst)}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-zinc-700 light:hover:bg-zinc-100"
            >
              <span className="text-zinc-200 light:text-zinc-800">{inst.name}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {inst.ticker ?? ""} {inst.isin ?? ""} {inst.wkn ?? ""}
              </span>
            </button>
          ))}
        </div>
      )}
      {selectedInstrument && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-zinc-500 hover:text-zinc-300"
        >
          ×
        </button>
      )}
    </div>
  );
}

function InstrumentLookupNamespace() {
  return null;
}
InstrumentLookupNamespace.SearchInput = SearchInputInner;

export const InstrumentLookup = InstrumentLookupNamespace;
