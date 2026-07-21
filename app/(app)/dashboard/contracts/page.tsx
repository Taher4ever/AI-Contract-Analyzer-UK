import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchX, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getContractsList } from "@/lib/contracts/list-data";
import { ContractRow } from "@/components/dashboard/contract-row";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import type { ContractStatus } from "@/types/database";

export const metadata: Metadata = { title: "Contracts" };

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const favoritesOnly = params.favorites === "1";
  const status =
    typeof params.status === "string" ? (params.status as ContractStatus) : undefined;
  const folderId = typeof params.folder === "string" ? params.folder : undefined;
  const sort =
    typeof params.sort === "string"
      ? (params.sort as "newest" | "oldest" | "risk")
      : "newest";

  const [contracts, { data: folders }, { count: totalCount }] = await Promise.all([
    getContractsList(supabase, user.id, { favoritesOnly, status, folderId, sort }),
    supabase.from("folders").select("id, name").eq("user_id", user.id).order("name"),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Contracts</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        All the contracts you&apos;ve uploaded, in one place.
      </p>

      {(totalCount ?? 0) > 0 && (
        <div className="mt-6">
          <FilterBar folders={folders ?? []} />
        </div>
      )}

      <div className="mt-6 space-y-3">
        {contracts.length === 0 ? (
          <div className="glass shadow-soft rounded-2xl">
            {(totalCount ?? 0) === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No contracts yet"
                description="Upload your first contract to get a plain-English summary and risk score."
                actionLabel="Upload contract"
                actionHref="/dashboard/upload"
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="No contracts match this filter"
                description="Try a different filter or clear it to see all your contracts."
                actionLabel="Clear filters"
                actionHref="/dashboard/contracts"
              />
            )}
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
