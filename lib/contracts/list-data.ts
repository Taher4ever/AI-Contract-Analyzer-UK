import type { createClient } from "@/lib/supabase/server";
import { storedSectionsSchema, type ContractType } from "@/lib/ai/schemas";
import type { ContractFileType, ContractStatus } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface ContractListFilters {
  favoritesOnly?: boolean;
  folderId?: string | null;
  status?: ContractStatus;
  sort?: "newest" | "oldest" | "risk";
}

export interface ContractListRow {
  id: string;
  title: string;
  fileType: ContractFileType;
  status: ContractStatus;
  isFavorite: boolean;
  folderId: string | null;
  folderName: string | null;
  createdAt: string;
  riskScore: number | null;
  contractType: ContractType | null;
}

export async function getContractsList(
  supabase: SupabaseServerClient,
  userId: string,
  filters: ContractListFilters = {}
): Promise<ContractListRow[]> {
  let query = supabase
    .from("contracts")
    .select("id, title, file_type, status, is_favorite, folder_id, created_at")
    .eq("user_id", userId);

  if (filters.favoritesOnly) query = query.eq("is_favorite", true);
  if (filters.folderId === null) query = query.is("folder_id", null);
  else if (filters.folderId) query = query.eq("folder_id", filters.folderId);
  if (filters.status) query = query.eq("status", filters.status);

  query = query.order("created_at", { ascending: filters.sort === "oldest" });

  const [{ data: contracts }, { data: analyses }, { data: folders }] =
    await Promise.all([
      query,
      supabase.from("analyses").select("contract_id, risk_score, sections"),
      supabase.from("folders").select("id, name").eq("user_id", userId),
    ]);

  const analysisMap = new Map((analyses ?? []).map((a) => [a.contract_id, a]));
  const folderMap = new Map((folders ?? []).map((f) => [f.id, f.name]));

  let rows: ContractListRow[] = (contracts ?? []).map((c) => {
    const analysis = analysisMap.get(c.id);
    let contractType: ContractType | null = null;
    if (analysis?.sections) {
      const parsed = storedSectionsSchema.safeParse(analysis.sections);
      if (parsed.success) contractType = parsed.data.contractType;
    }
    return {
      id: c.id,
      title: c.title,
      fileType: c.file_type,
      status: c.status,
      isFavorite: c.is_favorite,
      folderId: c.folder_id,
      folderName: c.folder_id ? (folderMap.get(c.folder_id) ?? null) : null,
      createdAt: c.created_at,
      riskScore: analysis?.risk_score ?? null,
      contractType,
    };
  });

  if (filters.sort === "risk") {
    rows = [...rows].sort((a, b) => (b.riskScore ?? -1) - (a.riskScore ?? -1));
  }

  return rows;
}

export async function getFolderCounts(
  supabase: SupabaseServerClient,
  userId: string
): Promise<Map<string, number>> {
  const { data } = await supabase
    .from("contracts")
    .select("folder_id")
    .eq("user_id", userId)
    .not("folder_id", "is", null);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.folder_id) continue;
    counts.set(row.folder_id, (counts.get(row.folder_id) ?? 0) + 1);
  }
  return counts;
}
