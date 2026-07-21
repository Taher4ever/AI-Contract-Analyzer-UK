import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan, role")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      email={user.email ?? ""}
      fullName={profile?.full_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      plan={profile?.plan ?? "free"}
      role={profile?.role ?? "user"}
    >
      {children}
    </DashboardShell>
  );
}
