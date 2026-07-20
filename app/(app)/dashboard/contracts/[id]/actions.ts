"use server";

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
