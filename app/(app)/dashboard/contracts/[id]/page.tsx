import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Contract" };

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, title, original_filename, status, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!contract) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6 text-center lg:p-8">
      <div className="glass shadow-soft rounded-2xl p-10">
        <h1 className="text-xl font-semibold">{contract.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {contract.original_filename}
        </p>
        <p className="text-muted-foreground mt-6 text-sm">
          Analysis coming in Phase 8.
        </p>
      </div>
    </div>
  );
}
