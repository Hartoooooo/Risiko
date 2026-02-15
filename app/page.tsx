import { dashboardAdapter } from "@/lib/adapter";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const header = await dashboardAdapter.getHeaderData();

  return (
    <main className="min-h-screen bg-zinc-950 light:bg-zinc-100">
      <DashboardHeader title={header.headerTitle} />
      <DashboardContent />
    </main>
  );
}
