import { dashboardAdapter, sentimentAdapter, exposureHeatmapAdapter } from "@/lib/adapter";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const header = await dashboardAdapter.getHeaderData();
  const sentimentGauges = await sentimentAdapter.getSentimentGauges();
  const exposureHeatmap = await exposureHeatmapAdapter.getExposureHeatmap();

  return (
    <main className="min-h-screen bg-zinc-950 light:bg-zinc-100">
      <DashboardHeader title={header.headerTitle} />
      <DashboardContent
        sentimentGauges={sentimentGauges}
        exposureHeatmap={exposureHeatmap}
      />
    </main>
  );
}
