"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { error?: string; success?: boolean };

const mimeExt: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function updateProfile(values: {
  fullName: string;
}): Promise<ActionResult> {
  const parsed = z
    .object({ fullName: z.string().min(1, "Please enter your name.").max(120) })
    .safeParse(values);
  if (!parsed.success) return { error: "Please enter a valid name." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);
  if (error) return { error: "Could not update profile." };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function uploadAvatar(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Please upload an image file." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Image must be under 2MB." };
  }

  const ext = mimeExt[file.type] ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { error: "Could not upload image." };

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);
  if (error) return { error: "Could not save avatar." };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "Could not delete account." };

  await supabase.auth.signOut();
  redirect("/");
}
