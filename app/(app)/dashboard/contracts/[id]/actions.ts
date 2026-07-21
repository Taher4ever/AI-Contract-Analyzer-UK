"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteContractRecord } from "@/lib/contracts/delete";
import { isPaidPlan } from "@/lib/stripe/plans";

export type ActionResult = { error?: string };
export type ShareLinkResult =
  | { success: true; token: string }
  | { success: false; error: string; code?: "pro_required" };

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

export async function createShareLink(contractId: string): Promise<ShareLinkResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  if (!isPaidPlan(profile?.plan ?? "free")) {
    return {
      success: false,
      error: "Share links are a Pro feature.",
      code: "pro_required",
    };
  }

  const { data: contract } = await supabase
    .from("contracts")
    .select("id")
    .eq("id", contractId)
    .eq("user_id", user.id)
    .single();
  if (!contract) return { success: false, error: "Contract not found." };

  const { data: existing } = await supabase
    .from("shared_links")
    .select("token")
    .eq("contract_id", contractId)
    .maybeSingle();
  if (existing) return { success: true, token: existing.token };

  const token = crypto.randomBytes(16).toString("hex");
  const { error } = await supabase
    .from("shared_links")
    .insert({ contract_id: contractId, token });
  if (error) return { success: false, error: "Could not create share link." };

  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, token };
}

export async function revokeShareLink(contractId: string): Promise<ActionResult> {
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
    .from("shared_links")
    .delete()
    .eq("contract_id", contractId);
  if (error) return { error: "Could not revoke share link." };

  revalidatePath(`/dashboard/contracts/${contractId}`);
  return {};
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
