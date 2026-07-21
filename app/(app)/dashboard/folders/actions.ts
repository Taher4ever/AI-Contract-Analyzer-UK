"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string };
export type CreateFolderResult = { error?: string; folderId?: string };

function revalidateFolderPaths() {
  revalidatePath("/dashboard/folders");
  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard");
}

export async function createFolder(name: string): Promise<CreateFolderResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Folder name cannot be empty." };
  if (trimmed.length > 100) return { error: "Folder name is too long." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data, error } = await supabase
    .from("folders")
    .insert({ user_id: user.id, name: trimmed })
    .select("id")
    .single();
  if (error || !data) return { error: "Could not create folder." };

  revalidateFolderPaths();
  return { folderId: data.id };
}

export async function renameFolder(
  folderId: string,
  name: string
): Promise<ActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Folder name cannot be empty." };
  if (trimmed.length > 100) return { error: "Folder name is too long." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("folders")
    .update({ name: trimmed })
    .eq("id", folderId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not rename folder." };

  revalidateFolderPaths();
  return {};
}

export async function deleteFolder(folderId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", user.id);
  if (error) return { error: "Could not delete folder." };

  revalidateFolderPaths();
  return {};
}
