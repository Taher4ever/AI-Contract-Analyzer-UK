import { fetchReportData } from "@/lib/export/fetch-analysis";
import { sanitizeFilename } from "@/lib/export/filename";
import { buildContractDocx } from "@/lib/export/docx-report";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const result = await fetchReportData(contractId);
  if ("error" in result) {
    return new Response(result.error, { status: result.status });
  }

  const buffer = await buildContractDocx(result.data);
  const filename = `${sanitizeFilename(result.data.title)}-analysis.docx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
