import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getContractsList } from "@/lib/contracts/list-data";
import { ContractRow } from "@/components/dashboard/contract-row";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Folder" };

export default async function FolderPage({
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

  const { data: folder } = await supabase
    .from("folders")
    .select("id, name")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!folder) notFound();

  const [contracts, { data: folders }] = await Promise.all([
    getContractsList(supabase, user.id, { folderId: id }),
    supabase.from("folders").select("id, name").eq("user_id", user.id).order("name"),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/dashboard/folders"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Folders
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{folder.name}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {contracts.length} contract{contracts.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 space-y-3">
        {contracts.length === 0 ? (
          <div className="glass shadow-soft rounded-2xl">
            <EmptyState
              icon={SearchX}
              title="This folder is empty"
              description="Move a contract here from the contracts list or the contract page."
            />
          </div>
        ) : (
          contracts.map((contract) => (
            <ContractRow key={contract.id} contract={contract} folders={folders ?? []} />
          ))
        )}
      </div>
    </div>
  );
}
