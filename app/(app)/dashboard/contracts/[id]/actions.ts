"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string };

export async function reanalyzeContract(contractId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("id")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();
  if (!contract) return { error: "Contract not found." };

  await supabase.from("analyses").delete().eq("contract_id", contractId);
  await supabase
    .from("contracts")
    .update({ status: "uploaded" })
    .eq("id", contractId);

  revalidatePath(`/dashboard/contracts/${contractId}`);
  return {};
}

export async function updateContractTitle(
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

  revalidatePath(`/dashboard/contracts/${contractId}`);
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

  revalidatePath(`/dashboard/contracts/${contractId}`);
  return {};
}

export async function deleteContract(contractId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, file_path")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();
  if (!contract) return { error: "Contract not found." };

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", contractId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not delete contract." };

  await supabase.storage.from("contracts").remove([contract.file_path]);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
