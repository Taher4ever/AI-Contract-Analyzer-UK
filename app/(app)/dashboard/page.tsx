import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/shared/sign-out-button";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Minimal placeholder — the real dashboard shell is built in Phase 6.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-grain flex min-h-dvh items-center justify-center p-6">
      <div className="glass shadow-soft rounded-2xl p-8 text-center">
        <p className="text-muted-foreground text-sm">Signed in as</p>
        <p className="mt-1 font-semibold">{user?.email}</p>
        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
          The full dashboard is built in the next phase.
        </p>
        <SignOutButton className="text-primary mt-6 text-sm font-medium hover:underline">
          Sign out
        </SignOutButton>
      </div>
    </div>
  );
}
