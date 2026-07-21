import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  uploaded: { label: "Uploaded", className: "text-muted-foreground" },
  processing: { label: "Analyzing…", className: "text-blue-600 dark:text-blue-400" },
  analyzed: { label: "Analyzed", className: "text-emerald-600 dark:text-emerald-400" },
  failed: { label: "Failed", className: "text-rose-600 dark:text-rose-400" },
};

export function TeamContractRow({
  title,
  status,
  createdAt,
  uploaderName,
}: {
  title: string;
  status: string;
  createdAt: string;
  uploaderName: string;
}) {
  const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS.uploaded;

  return (
    <div className="glass shadow-soft flex items-center gap-3 rounded-2xl p-4">
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={statusInfo.className}>{statusInfo.label}</span>
          <span>Uploaded by {uploaderName}</span>
          <span>
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <Badge variant="outline">Read-only</Badge>
    </div>
  );
}
