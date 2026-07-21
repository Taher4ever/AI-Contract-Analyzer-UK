"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDocument } from "@/app/(admin)/admin/documents/actions";
import type { ContractStatus } from "@/types/database";

export interface AdminDocumentRow {
  id: string;
  title: string;
  ownerEmail: string;
  status: ContractStatus;
  riskScore: number | null;
  createdAt: string;
}

const STATUS_LABELS: Record<ContractStatus, { label: string; className: string }> = {
  uploaded: { label: "Uploaded", className: "text-muted-foreground" },
  processing: { label: "Analyzing…", className: "text-blue-600 dark:text-blue-400" },
  analyzed: { label: "Analyzed", className: "text-emerald-600 dark:text-emerald-400" },
  failed: { label: "Failed", className: "text-rose-600 dark:text-rose-400" },
};

function DeleteDocumentButton({ document }: { document: AdminDocumentRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteDocument(document.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="icon-sm" aria-label={`Delete ${document.title}`} />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this document?</DialogTitle>
          <DialogDescription>
            This permanently removes &quot;{document.title}&quot;, its analysis and chat history
            for {document.ownerEmail}. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DocumentsTable({
  documents,
  emptyTitle,
  emptyDescription,
}: {
  documents: AdminDocumentRow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const columns: DataTableColumn<AdminDocumentRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (d) => (
        <Link href={`/admin/documents/${d.id}`} className="font-medium hover:underline">
          {d.title}
        </Link>
      ),
    },
    { key: "owner", header: "Owner", render: (d) => d.ownerEmail },
    {
      key: "status",
      header: "Status",
      render: (d) => (
        <span className={STATUS_LABELS[d.status].className}>
          {STATUS_LABELS[d.status].label}
        </span>
      ),
    },
    {
      key: "risk",
      header: "Risk",
      render: (d) =>
        d.riskScore === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Badge
            variant="outline"
            className={cn(
              d.riskScore >= 66
                ? "border-rose-500/40 text-rose-600 dark:text-rose-400"
                : d.riskScore >= 33
                  ? "border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
            )}
          >
            {d.riskScore}
          </Badge>
        ),
    },
    {
      key: "created",
      header: "Created",
      render: (d) =>
        new Date(d.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (d) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`View ${d.title}`}
            nativeButton={false}
            render={<Link href={`/admin/documents/${d.id}`} />}
          >
            <Eye className="size-4" />
          </Button>
          <DeleteDocumentButton document={d} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={documents}
      emptyIcon={FileText}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
