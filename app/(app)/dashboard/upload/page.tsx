import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";

export const metadata: Metadata = { title: "Upload contract" };

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();

  let monthCount: number | null = null;
  if ((profile?.plan ?? "free") === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .gte("created_at", startOfMonth.toISOString());
    monthCount = count ?? 0;
  }

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Upload a contract</h1>
      <p className="text-muted-foreground mt-1">
        We&apos;ll extract the text and get it ready for analysis.
      </p>
      {monthCount !== null && (
        <p className="text-muted-foreground mt-4 text-sm">
          {monthCount} / 3 documents used this month
        </p>
      )}
      <div className="mt-6">
        <UploadDropzone />
      </div>
    </div>
  );
}
