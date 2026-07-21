"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteContractRecord } from "@/lib/contracts/delete";
import { storedSectionsSchema, type ContractType } from "@/lib/ai/schemas";

export type ActionResult = { error?: string };

function revalidateContractPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard/folders", "layout");
}

export async function renameContract(
  contractId: string,
  title: string
): Promise<ActionResult> {
  const trimmed = title.trim();
  if (!trimmed) return { error: "Title cannot be empty." };
  if (trimmed.length > 200) return { error: "Title is too long." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("contracts")
    .update({ title: trimmed })
    .eq("id", contractId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not rename contract." };

  revalidateContractPaths();
  return {};
}

export async function toggleFavorite(
  contractId: string,
  isFavorite: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("contracts")
    .update({ is_favorite: isFavorite })
    .eq("id", contractId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not update favorite." };

  revalidateContractPaths();
  return {};
}

export async function moveToFolder(
  contractId: string,
  folderId: string | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  if (folderId) {
    const { data: folder } = await supabase
      .from("folders")
      .select("id")
      .eq("id", folderId)
      .eq("user_id", user.id)
      .single();
    if (!folder) return { error: "Folder not found." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({ folder_id: folderId })
    .eq("id", contractId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not move contract." };

  revalidateContractPaths();
  return {};
}

export async function deleteContract(contractId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const result = await deleteContractRecord(supabase, contractId, user.id);
  if (!result.success) return { error: result.error };

  revalidateContractPaths();
  return {};
}

export interface SearchResult {
  id: string;
  title: string;
  contractType: ContractType | null;
}

export async function searchContracts(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const lowerQuery = trimmed.toLowerCase();

  const [{ data: byTitle }, { data: allAnalyses }] = await Promise.all([
    supabase
      .from("contracts")
      .select("id, title")
      .eq("user_id", user.id)
      .ilike("title", `%${trimmed}%`)
      .limit(8),
    supabase.from("analyses").select("contract_id, sections"),
  ]);

  const contractTypeById = new Map<string, ContractType>();
  const matchingByType: string[] = [];
  for (const a of allAnalyses ?? []) {
    const parsed = storedSectionsSchema.safeParse(a.sections);
    if (!parsed.success) continue;
    contractTypeById.set(a.contract_id, parsed.data.contractType);
    if (parsed.data.contractType.toLowerCase().includes(lowerQuery)) {
      matchingByType.push(a.contract_id);
    }
  }

  const results = new Map<string, SearchResult>();

  for (const c of byTitle ?? []) {
    results.set(c.id, {
      id: c.id,
      title: c.title,
      contractType: contractTypeById.get(c.id) ?? null,
    });
  }

  if (matchingByType.length > 0 && results.size < 8) {
    const { data: byType } = await supabase
      .from("contracts")
      .select("id, title")
      .eq("user_id", user.id)
      .in("id", matchingByType)
      .limit(8);
    for (const c of byType ?? []) {
      if (!results.has(c.id)) {
        results.set(c.id, {
          id: c.id,
          title: c.title,
          contractType: contractTypeById.get(c.id) ?? null,
        });
      }
    }
  }

  return Array.from(results.values()).slice(0, 8);
}
