import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="glass shadow-soft mt-6 rounded-2xl p-6">
        <h2 className="font-semibold">Profile</h2>
        <ProfileForm
          fullName={profile?.full_name ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
          email={user!.email ?? ""}
        />
      </div>

      <div className="border-destructive/30 bg-destructive/5 mt-8 rounded-2xl border p-6">
        <h2 className="text-destructive font-semibold">Danger zone</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Permanently delete your account and all your contracts. This cannot
          be undone.
        </p>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}
