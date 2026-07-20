import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Gauge, ShieldCheck, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user!.id)
    .single();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const analyzedCountQuery = supabase
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("status", "analyzed");
  const monthCountQuery = supabase
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("created_at", startOfMonth.toISOString());
  const analysesQuery = supabase.from("analyses").select("risk_score");

  const [{ count: analyzedCount }, { count: monthCount }, { data: analyses }] =
    await Promise.all([analyzedCountQuery, monthCountQuery, analysesQuery]);

  const scores = (analyses ?? [])
    .map((a) => a.risk_score)
    .filter((n): n is number => typeof n === "number");
  const avgRisk = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const firstName =
    profile?.full_name?.split(" ")[0] || user!.email?.split("@")[0] || "there";
  const plan = profile?.plan ?? "free";

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">
        {greeting()}, {firstName}
      </h1>
      <p className="text-muted-foreground mt-1">
        Here&apos;s what&apos;s happening with your contracts.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <StatCard icon={FileText} label="Contracts analyzed" value={analyzedCount ?? 0} />
        <StatCard
          icon={UploadCloud}
          label="This month"
          value={monthCount ?? 0}
          suffix={plan === "free" ? " / 3" : undefined}
          ring={plan === "free" ? { max: 3 } : undefined}
        />
        <StatCard icon={Gauge} label="Average risk score" value={avgRisk} />
      </div>

      <Link
        href="/dashboard/upload"
        className="glass shadow-soft-lg group mt-6 flex items-center gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
      >
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
          <UploadCloud className="size-6" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Upload a contract</p>
          <p className="text-muted-foreground text-sm">
            Get a risk score and plain-English summary in minutes.
          </p>
        </div>
        <ArrowRight className="text-muted-foreground group-hover:text-foreground size-5 transition-colors" />
      </Link>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Recent contracts</h2>
        <div className="glass shadow-soft mt-4 rounded-2xl">
          <EmptyState
            icon={ShieldCheck}
            title="No contracts yet"
            description="Upload your first contract to get a plain-English summary and risk score."
            actionLabel="Upload contract"
            actionHref="/dashboard/upload"
          />
        </div>
      </div>
    </div>
  );
}
