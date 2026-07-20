"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Download, Loader2, Pencil, Star, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReanalyzeButton } from "@/components/dashboard/reanalyze-button";
import {
  deleteContract,
  toggleFavorite,
  updateContractTitle,
} from "@/app/(app)/dashboard/contracts/[id]/actions";
import type { ContractType } from "@/lib/ai/schemas";

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  tenancy: "Tenancy agreement",
  employment: "Employment contract",
  freelance: "Freelance agreement",
  nda: "NDA",
  other: "Other agreement",
};

export function AnalysisHeader({
  contractId,
  title,
  createdAt,
  isFavorite,
  contractType,
}: {
  contractId: string;
  title: string;
  createdAt: string;
  isFavorite: boolean;
  contractType: ContractType;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFavPending, startFavTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [favorite, setFavorite] = useState(isFavorite);

  const saveTitle = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed || trimmed === title) {
      setDraftTitle(title);
      setIsEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await updateContractTitle(contractId, trimmed);
      if (result?.error) {
        toast.error(result.error);
        setDraftTitle(title);
      }
      setIsEditing(false);
      router.refresh();
    });
  };

  const onToggleFavorite = () => {
    const next = !favorite;
    setFavorite(next);
    startFavTransition(async () => {
      const result = await toggleFavorite(contractId, next);
      if (result?.error) {
        toast.error(result.error);
        setFavorite(!next);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setDraftTitle(title);
                  setIsEditing(false);
                }
              }}
              className="h-9 text-xl font-semibold sm:w-96"
              disabled={isPending}
            />
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={saveTitle}
              disabled={isPending}
              aria-label="Save title"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setDraftTitle(title);
                setIsEditing(false);
              }}
              disabled={isPending}
              aria-label="Cancel"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="group flex items-center gap-2">
            <h1 className="truncate text-2xl font-semibold">{title}</h1>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Rename contract"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={onToggleFavorite}
              disabled={isFavPending}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={
                  favorite ? "size-5 fill-amber-400 text-amber-400" : "size-5"
                }
              />
            </button>
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{CONTRACT_TYPE_LABELS[contractType]}</Badge>
          <span className="text-muted-foreground text-xs">
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="outline" size="sm" className="rounded-full" disabled />
            }
          >
            <Download className="size-4" />
            Export
          </TooltipTrigger>
          <TooltipContent>Coming soon</TooltipContent>
        </Tooltip>
        <ReanalyzeButton contractId={contractId} />
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="destructive" size="icon-sm" aria-label="Delete contract" />
            }
          >
            <Trash2 className="size-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this contract?</DialogTitle>
              <DialogDescription>
                This permanently deletes the document, its analysis and chat
                history. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              <Button
                variant="destructive"
                disabled={isDeletePending}
                onClick={() =>
                  startDeleteTransition(async () => {
                    const result = await deleteContract(contractId);
                    if (result?.error) toast.error(result.error);
                  })
                }
              >
                {isDeletePending && <Loader2 className="size-4 animate-spin" />}
                Yes, delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
