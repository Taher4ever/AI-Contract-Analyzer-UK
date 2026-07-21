import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getContractsList } from "@/lib/contracts/list-data";
import { ContractRow } from "@/components/dashboard/contract-row";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Favorites" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [contracts, { data: folders }] = await Promise.all([
    getContractsList(supabase, user.id, { favoritesOnly: true }),
    supabase.from("folders").select("id, name").eq("user_id", user.id).order("name"),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Contracts you&apos;ve starred for quick access.
      </p>

      <div className="mt-6 space-y-3">
        {contracts.length === 0 ? (
          <div className="glass shadow-soft rounded-2xl">
            <EmptyState
              icon={Star}
              title="No favorites yet"
              description="Star a contract from its page or the contracts list to see it here."
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
