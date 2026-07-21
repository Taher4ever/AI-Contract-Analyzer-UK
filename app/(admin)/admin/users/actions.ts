"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan, UserRole } from "@/types/database";

export type AdminActionResult = { success: true } | { success: false; error: string };

export async function changeUserRole(userId: string, role: UserRole): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const parsed = z.enum(["user", "admin"]).safeParse(role);
  if (!parsed.success) return { success: false, error: "Invalid role." };

  if (admin.id === userId && parsed.data === "user") {
    return { success: false, error: "You cannot remove your own admin access." };
  }

  const { error } = await createAdminClient()
    .from("profiles")
    .update({ role: parsed.data })
    .eq("id", userId);
  if (error) return { success: false, error: "Could not update role." };

  revalidatePath("/admin/users");
  return { success: true };
}

export async function changeUserPlan(userId: string, plan: Plan): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const parsed = z.enum(["free", "pro", "team"]).safeParse(plan);
  if (!parsed.success) return { success: false, error: "Invalid plan." };

  const { error } = await createAdminClient()
    .from("profiles")
    .update({ plan: parsed.data })
    .eq("id", userId);
  if (error) return { success: false, error: "Could not update plan." };

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };
  if (admin.id === userId) return { success: false, error: "You cannot delete your own account." };

  const adminClient = createAdminClient();

  const { data: files } = await adminClient.storage.from("contracts").list(userId, { limit: 1000 });
  if (files && files.length > 0) {
    await adminClient.storage.from("contracts").remove(files.map((f) => `${userId}/${f.name}`));
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { success: false, error: "Could not delete user." };

  revalidatePath("/admin/users");
  return { success: true };
}
