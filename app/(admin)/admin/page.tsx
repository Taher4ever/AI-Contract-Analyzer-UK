import type { Metadata } from "next";
import { Banknote, FileCheck2, UserPlus, Users, Zap } from "lucide-react";
import { getOverviewStats } from "@/lib/admin/analytics";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyBarChart, PlanDonutChart } from "@/components/admin/overview-charts";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        A snapshot of ContractLens AI right now.
      </p>

      <FadeInStagger faster className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <FadeIn>
          <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        </FadeIn>
        <FadeIn>
          <StatCard icon={Zap} label="Active subscriptions" value={stats.activeSubscriptions} />
        </FadeIn>
        <FadeIn>
          <StatCard icon={Banknote} label="MRR" value={stats.mrr} prefix="£" />
        </FadeIn>
        <FadeIn>
          <StatCard icon={FileCheck2} label="Contracts analyzed" value={stats.contractsAnalyzed} />
        </FadeIn>
        <FadeIn>
          <StatCard icon={UserPlus} label="Signups this month" value={stats.signupsThisMonth} />
        </FadeIn>
      </FadeInStagger>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <FadeIn className="glass shadow-soft rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-semibold">Plan distribution</h2>
          <div className="mt-6">
            <PlanDonutChart data={stats.planDistribution} />
          </div>
        </FadeIn>
        <FadeIn className="glass shadow-soft rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-semibold">Signups per week</h2>
          <p className="text-muted-foreground text-xs">Last 12 weeks</p>
          <div className="mt-6">
            <WeeklyBarChart data={stats.signupsPerWeek} />
          </div>
        </FadeIn>
        <FadeIn className="glass shadow-soft rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-semibold">Contracts per week</h2>
          <p className="text-muted-foreground text-xs">Last 12 weeks</p>
          <div className="mt-6">
            <WeeklyBarChart data={stats.contractsPerWeek} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
