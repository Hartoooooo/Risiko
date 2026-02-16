"use client";

import type { ExposureHeatmapData, ExposureHeatmapTile } from "@/lib/adapter/types";
import { ExposureHeatmapTile as TileComponent } from "./ExposureHeatmapTile";

type ExposureHeatmapSectionProps = {
  data: ExposureHeatmapData;
};

function onTileClick(_tile: ExposureHeatmapTile) {
  // Placeholder: später Instrument-Lookup oder Sidepanel
}

export function ExposureHeatmapSection({ data }: ExposureHeatmapSectionProps) {
  return (
    <section className="w-full px-4 pt-4">
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            maxAbsTotalExposureEur={data.maxAbsTotalExposureEur}
            onTileClick={onTileClick}
          />
        ))}
      </div>
    </section>
  );
}
