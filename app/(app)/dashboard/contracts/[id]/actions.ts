"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteContractRecord } from "@/lib/contracts/delete";

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

export async function deleteContract(contractId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const result = await deleteContractRecord(supabase, contractId, user.id);
  if (!result.success) return { error: result.error };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function clearChatMessages(contractId: string): Promise<ActionResult> {
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

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("contract_id", contractId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not clear conversation." };

  revalidatePath(`/dashboard/contracts/${contractId}`);
  return {};
}
