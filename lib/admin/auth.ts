import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Returns the signed-in user only if they have profiles.role = 'admin',
// otherwise null. Used by admin server actions to gate mutations; the
// admin layout does its own session-vs-role distinction so it can
// redirect (no session) vs 404 (wrong role) appropriately.
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;

  return user;
}
