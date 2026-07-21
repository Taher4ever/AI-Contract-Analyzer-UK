import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsersTable, type AdminUserRow } from "@/components/admin/users-table";
import { AdminSearchInput } from "@/components/admin/admin-search-input";
import { AdminPagination } from "@/components/admin/pagination";

export const metadata: Metadata = { title: "Admin Users" };

const PAGE_SIZE = 20;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);

  const admin = createAdminClient();
  let query = admin
    .from("profiles")
    .select("id, email, full_name, plan, role, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("email", `%${q}%`);

  const from = (page - 1) * PAGE_SIZE;
  const { data: profiles, count } = await query.range(from, from + PAGE_SIZE - 1);

  const ids = (profiles ?? []).map((p) => p.id);
  const { data: contractRows } = ids.length
    ? await admin.from("contracts").select("user_id").in("user_id", ids)
    : { data: [] as { user_id: string }[] };

  const contractCounts = new Map<string, number>();
  for (const row of contractRows ?? []) {
    contractCounts.set(row.user_id, (contractCounts.get(row.user_id) ?? 0) + 1);
  }

  const rows: AdminUserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email ?? "—",
    fullName: p.full_name,
    plan: p.plan,
    role: p.role,
    contractsCount: contractCounts.get(p.id) ?? 0,
    createdAt: p.created_at,
  }));

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="text-muted-foreground mt-1 text-sm">{count ?? 0} total users.</p>

      <div className="mt-6">
        <AdminSearchInput placeholder="Search by email…" paramKey="q" />
      </div>

      <div className="mt-4">
        <UsersTable
          users={rows}
          emptyTitle={q ? "No users match this search" : "No users yet"}
          emptyDescription={
            q ? "Try a different email." : "Users will appear here once people sign up."
          }
        />
      </div>

      <AdminPagination page={page} pageCount={pageCount} basePath="/admin/users" searchParams={{ q }} />
    </div>
  );
}
