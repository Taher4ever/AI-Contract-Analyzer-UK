import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function deleteContractRecord(
  supabase: SupabaseServerClient,
  contractId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: contract } = await supabase
    .from("contracts")
    .select("id, file_path")
    .eq("id", contractId)
    .eq("user_id", userId)
    .single();
  if (!contract) return { success: false, error: "Contract not found." };

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", contractId)
    .eq("user_id", userId);
  if (error) return { success: false, error: "Could not delete contract." };

  await supabase.storage.from("contracts").remove([contract.file_path]);

  return { success: true };
}
