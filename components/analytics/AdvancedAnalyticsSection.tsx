"use client";

import { ExposureTimelineChart } from "./ExposureTimelineChart";
import { InstrumentLookup, InstrumentLookupProvider } from "./InstrumentLookup";

export function AdvancedAnalyticsSection() {
  return (
    <InstrumentLookupProvider>
      <section className="hidden w-full space-y-6 px-4 pb-8">
        <ExposureTimelineChart
          instrumentSearchSlot={<InstrumentLookup.SearchInput />}
        />
      </section>
    </InstrumentLookupProvider>
  );
}
