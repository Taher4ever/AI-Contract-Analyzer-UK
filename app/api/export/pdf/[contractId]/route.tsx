import { renderToBuffer } from "@react-pdf/renderer";
import { fetchReportData } from "@/lib/export/fetch-analysis";
import { sanitizeFilename } from "@/lib/export/filename";
import { ContractPdfReport } from "@/lib/export/pdf-report";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const result = await fetchReportData(contractId);
  if ("error" in result) {
    return new Response(result.error, { status: result.status });
  }

  const buffer = await renderToBuffer(<ContractPdfReport {...result.data} />);
  const filename = `${sanitizeFilename(result.data.title)}-analysis.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
