import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AnalysisRunner } from "@/components/dashboard/analysis-runner";
import { ReanalyzeButton } from "@/components/dashboard/reanalyze-button";

export const metadata: Metadata = { title: "Contract" };

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, title, original_filename, status, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!contract) notFound();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("contract_id", id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">{contract.title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {contract.original_filename}
      </p>

      <div className="mt-6">
        {analysis ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analysis</h2>
              <ReanalyzeButton contractId={contract.id} />
            </div>
            <p className="text-muted-foreground/80 mt-2 text-xs">
              Not legal advice — ContractLens AI helps you understand
              documents, it does not replace a solicitor.
            </p>
            <pre className="glass shadow-soft mt-4 overflow-x-auto rounded-2xl p-4 text-xs">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </>
        ) : (
          <AnalysisRunner contractId={contract.id} />
        )}
      </div>
    </div>
  );
}
