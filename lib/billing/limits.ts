import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isPaidPlan } from "@/lib/stripe/plans";

export const FREE_MONTHLY_LIMIT = 3;

export interface UploadLimitStatus {
  allowed: boolean;
  used: number;
  limit: number | null;
}

export async function canUploadContract(userId: string): Promise<UploadLimitStatus> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();
  const plan = profile?.plan ?? "free";

  if (isPaidPlan(plan)) {
    return { allowed: true, used: 0, limit: null };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const used = count ?? 0;
  return { allowed: used < FREE_MONTHLY_LIMIT, used, limit: FREE_MONTHLY_LIMIT };
}
