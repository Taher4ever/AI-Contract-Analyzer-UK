import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DocumentsTable, type AdminDocumentRow } from "@/components/admin/documents-table";
import { AdminSearchInput } from "@/components/admin/admin-search-input";
import { AdminPagination } from "@/components/admin/pagination";

export const metadata: Metadata = { title: "Admin Documents" };

const PAGE_SIZE = 20;

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number(params.page) || 1);

  const admin = createAdminClient();
  let query = admin
    .from("contracts")
    .select("id, title, user_id, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("title", `%${q}%`);

  const from = (page - 1) * PAGE_SIZE;
  const { data: contracts, count } = await query.range(from, from + PAGE_SIZE - 1);

  const ids = (contracts ?? []).map((c) => c.id);
  const userIds = [...new Set((contracts ?? []).map((c) => c.user_id))];

  const [{ data: analyses }, { data: profiles }] = await Promise.all([
    ids.length
      ? admin.from("analyses").select("contract_id, risk_score").in("contract_id", ids)
      : Promise.resolve({ data: [] as { contract_id: string; risk_score: number | null }[] }),
    userIds.length
      ? admin.from("profiles").select("id, email").in("id", userIds)
      : Promise.resolve({ data: [] as { id: string; email: string | null }[] }),
  ]);

  const riskByContract = new Map((analyses ?? []).map((a) => [a.contract_id, a.risk_score]));
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email ?? "—"]));

  const rows: AdminDocumentRow[] = (contracts ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    ownerEmail: emailById.get(c.user_id) ?? "—",
    status: c.status,
    riskScore: riskByContract.get(c.id) ?? null,
    createdAt: c.created_at,
  }));

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Documents</h1>
      <p className="text-muted-foreground mt-1 text-sm">{count ?? 0} total contracts.</p>

      <div className="mt-6">
        <AdminSearchInput placeholder="Search by title…" paramKey="q" />
      </div>

      <div className="mt-4">
        <DocumentsTable
          documents={rows}
          emptyTitle={q ? "No documents match this search" : "No documents yet"}
          emptyDescription={
            q ? "Try a different title." : "Uploaded contracts will appear here."
          }
        />
      </div>

      <AdminPagination
        page={page}
        pageCount={pageCount}
        basePath="/admin/documents"
        searchParams={{ q }}
      />
    </div>
  );
}
