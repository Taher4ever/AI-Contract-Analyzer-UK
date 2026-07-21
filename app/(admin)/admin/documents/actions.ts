"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminActionResult = { success: true } | { success: false; error: string };

export async function deleteDocument(contractId: string): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const adminClient = createAdminClient();
  const { data: contract } = await adminClient
    .from("contracts")
    .select("file_path")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract) return { success: false, error: "Contract not found." };

  const { error } = await adminClient.from("contracts").delete().eq("id", contractId);
  if (error) return { success: false, error: "Could not delete contract." };

  await adminClient.storage.from("contracts").remove([contract.file_path]);

  revalidatePath("/admin/documents");
  return { success: true };
}
