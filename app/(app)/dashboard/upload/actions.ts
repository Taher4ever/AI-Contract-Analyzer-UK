"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { extractDocx, extractPdf, splitIntoParagraphs } from "@/lib/extraction/extract";
import type { ContractFileType } from "@/types/database";

export type UploadResult =
  | { success: true; contractId: string }
  | { success: false; error: string; code?: "limit_reached" };

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function detectFileType(file: File): ContractFileType | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (file.type === DOCX_MIME || name.endsWith(".docx")) return "docx";
  return null;
}

export async function uploadContract(formData: FormData): Promise<UploadResult> {
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
  const plan = profile?.plan ?? "free";

  if (plan === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());
    if ((count ?? 0) >= 3) {
      return {
        success: false,
        error: "You've reached your free plan limit of 3 documents this month.",
        code: "limit_reached",
      };
    }
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose a file to upload." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "File must be under 10MB." };
  }

  const fileType = detectFileType(file);
  if (!fileType) {
    return { success: false, error: "Please upload a PDF or DOCX file." };
  }

  const buffer = await file.arrayBuffer();

  let text: string;
  try {
    text = fileType === "pdf" ? await extractPdf(buffer) : await extractDocx(buffer);
  } catch {
    return { success: false, error: "Could not read this file. It may be corrupted." };
  }

  const paragraphs = splitIntoParagraphs(text);
  if (paragraphs.length === 0) {
    return {
      success: false,
      error:
        "We couldn't find any text in this file. Scanned PDFs without a text layer aren't supported yet.",
    };
  }

  const path = `${user.id}/${crypto.randomUUID()}.${fileType}`;

  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(path, buffer, {
      contentType: file.type || (fileType === "pdf" ? "application/pdf" : DOCX_MIME),
    });
  if (uploadError) {
    return { success: false, error: "Could not upload file. Please try again." };
  }

  const title = file.name.replace(/\.(pdf|docx)$/i, "");

  const { data: contract, error: insertError } = await supabase
    .from("contracts")
    .insert({
      user_id: user.id,
      title,
      original_filename: file.name,
      file_type: fileType,
      file_path: path,
      status: "uploaded",
      paragraphs,
    })
    .select("id")
    .single();

  if (insertError || !contract) {
    await supabase.storage.from("contracts").remove([path]);
    return { success: false, error: "Could not save contract. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: true, contractId: contract.id };
}
