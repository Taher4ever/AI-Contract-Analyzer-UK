import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFolderCounts } from "@/lib/contracts/list-data";
import { FolderCard } from "@/components/dashboard/folder-card";
import { CreateFolderDialog } from "@/components/dashboard/create-folder-dialog";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Folders" };

export default async function FoldersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: folders }, counts] = await Promise.all([
    supabase.from("folders").select("id, name").eq("user_id", user.id).order("name"),
    getFolderCounts(supabase, user.id),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Folders</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Group your contracts however makes sense to you.
          </p>
        </div>
        <CreateFolderDialog />
      </div>

      <div className="mt-6">
        {!folders || folders.length === 0 ? (
          <div className="glass shadow-soft rounded-2xl">
            <EmptyState
              icon={FolderOpen}
              title="No folders yet"
              description="Create a folder to start organizing your contracts."
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                count={counts.get(folder.id) ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
