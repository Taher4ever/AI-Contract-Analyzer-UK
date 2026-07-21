"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  FileText,
  Folder,
  Loader2,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteContract,
  moveToFolder,
  renameContract,
  toggleFavorite,
} from "@/app/(app)/dashboard/contracts/actions";
import type { ContractListRow } from "@/lib/contracts/list-data";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  uploaded: { label: "Uploaded", className: "text-muted-foreground" },
  processing: {
    label: "Analyzing…",
    className: "text-blue-600 dark:text-blue-400",
  },
  analyzed: {
    label: "Analyzed",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  failed: { label: "Failed", className: "text-rose-600 dark:text-rose-400" },
};

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  tenancy: "Tenancy",
  employment: "Employment",
  freelance: "Freelance",
  nda: "NDA",
  other: "Other",
};

export function ContractRow({
  contract,
  folders,
}: {
  contract: ContractListRow;
  folders: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(contract.isFavorite);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(contract.title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRenamePending, startRenameTransition] = useTransition();
  const [isFavPending, startFavTransition] = useTransition();
  const [isMovePending, startMoveTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const onToggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    startFavTransition(async () => {
      const result = await toggleFavorite(contract.id, next);
      if (result?.error) {
        toast.error(result.error);
        setIsFavorite(!next);
      }
    });
  };

  const saveTitle = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed || trimmed === contract.title) {
      setDraftTitle(contract.title);
      setIsEditing(false);
      return;
    }
    startRenameTransition(async () => {
      const result = await renameContract(contract.id, trimmed);
      if (result?.error) {
        toast.error(result.error);
        setDraftTitle(contract.title);
      }
      setIsEditing(false);
      router.refresh();
    });
  };

  const onMove = (folderId: string | null) => {
    startMoveTransition(async () => {
      const result = await moveToFolder(contract.id, folderId);
      if (result?.error) toast.error(result.error);
      else router.refresh();
    });
  };

  const onDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteContract(contract.id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setIsDeleteOpen(false);
      router.refresh();
    });
  };

  const status = STATUS_LABELS[contract.status] ?? STATUS_LABELS.uploaded;

  return (
    <div className="glass shadow-soft flex items-center gap-3 rounded-2xl p-4">
      <Link
        href={`/dashboard/contracts/${contract.id}`}
        className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
      >
        <FileText className="size-5" />
      </Link>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <Input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setDraftTitle(contract.title);
                  setIsEditing(false);
                }
              }}
              disabled={isRenamePending}
              className="h-7 max-w-xs text-sm font-medium"
            />
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={saveTitle}
              disabled={isRenamePending}
              aria-label="Save"
            >
              {isRenamePending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => {
                setDraftTitle(contract.title);
                setIsEditing(false);
              }}
              disabled={isRenamePending}
              aria-label="Cancel"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <Link
            href={`/dashboard/contracts/${contract.id}`}
            className="truncate font-medium hover:underline"
          >
            {contract.title}
          </Link>
        )}
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
          {contract.contractType && (
            <Badge variant="secondary">
              {CONTRACT_TYPE_LABELS[contract.contractType] ?? contract.contractType}
            </Badge>
          )}
          <span className={status.className}>{status.label}</span>
          {contract.folderName && (
            <span className="inline-flex items-center gap-1">
              <Folder className="size-3" />
              {contract.folderName}
            </span>
          )}
          <span>
            {new Date(contract.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {contract.riskScore !== null && (
        <Badge
          variant="outline"
          className={cn(
            "shrink-0",
            contract.riskScore >= 66
              ? "border-rose-500/40 text-rose-600 dark:text-rose-400"
              : contract.riskScore >= 33
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400"
                : "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          )}
        >
          Risk {contract.riskScore}
        </Badge>
      )}

      <button
        type="button"
        onClick={onToggleFavorite}
        disabled={isFavPending}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="text-muted-foreground hover:text-foreground shrink-0 transition-transform active:scale-90"
      >
        <Star className={isFavorite ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Pencil />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isMovePending} onClick={() => onMove(null)}>
            <Folder />
            No folder
          </DropdownMenuItem>
          {folders.map((f) => (
            <DropdownMenuItem key={f.id} disabled={isMovePending} onClick={() => onMove(f.id)}>
              <Folder />
              {f.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this contract?</DialogTitle>
            <DialogDescription>
              This permanently deletes &quot;{contract.title}&quot;, its analysis
              and chat history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" disabled={isDeletePending} onClick={onDelete}>
              {isDeletePending && <Loader2 className="size-4 animate-spin" />}
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
