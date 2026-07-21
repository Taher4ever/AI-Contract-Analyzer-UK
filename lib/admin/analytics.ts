import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan, isPaidPlan } from "@/lib/stripe/plans";
import type { Plan } from "@/types/database";

export interface WeekBucket {
  weekStart: string;
  count: number;
}

export interface OverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  contractsAnalyzed: number;
  signupsThisMonth: number;
  signupsPerWeek: WeekBucket[];
  contractsPerWeek: WeekBucket[];
  planDistribution: { plan: Plan; count: number }[];
}

const WEEKS = 12;

function weekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

function bucketByWeek(rows: { created_at: string }[]): WeekBucket[] {
  const now = new Date();
  const buckets: WeekBucket[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    buckets.push({ weekStart: weekKey(d), count: 0 });
  }
  const byKey = new Map(buckets.map((b) => [b.weekStart, b]));
  for (const row of rows) {
    const bucket = byKey.get(weekKey(new Date(row.created_at)));
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const admin = createAdminClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - (WEEKS - 1) * 7);
  windowStart.setHours(0, 0, 0, 0);

  const [
    { count: totalUsers },
    { data: activeSubs },
    { count: contractsAnalyzed },
    { count: signupsThisMonth },
    { data: recentProfiles },
    { data: recentContracts },
    { count: freeCount },
    { count: proCount },
    { count: teamCount },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("subscriptions").select("plan").eq("status", "active"),
    admin
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("status", "analyzed"),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
    admin
      .from("profiles")
      .select("created_at")
      .gte("created_at", windowStart.toISOString()),
    admin
      .from("contracts")
      .select("created_at")
      .gte("created_at", windowStart.toISOString()),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "team"),
  ]);

  const mrr = (activeSubs ?? []).reduce(
    (sum, s) => sum + (isPaidPlan(s.plan) ? getPlan(s.plan).monthlyPrice : 0),
    0
  );

  return {
    totalUsers: totalUsers ?? 0,
    activeSubscriptions: activeSubs?.length ?? 0,
    mrr,
    contractsAnalyzed: contractsAnalyzed ?? 0,
    signupsThisMonth: signupsThisMonth ?? 0,
    signupsPerWeek: bucketByWeek(recentProfiles ?? []),
    contractsPerWeek: bucketByWeek(recentContracts ?? []),
    planDistribution: [
      { plan: "free", count: freeCount ?? 0 },
      { plan: "pro", count: proCount ?? 0 },
      { plan: "team", count: teamCount ?? 0 },
    ],
  };
}
