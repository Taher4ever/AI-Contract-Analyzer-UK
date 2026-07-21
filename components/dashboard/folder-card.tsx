"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Folder, Loader2, MoreVertical, Pencil, Trash2, X } from "lucide-react";
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
import { deleteFolder, renameFolder } from "@/app/(app)/dashboard/folders/actions";

export function FolderCard({
  folder,
  count,
}: {
  folder: { id: string; name: string };
  count: number;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(folder.name);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRenamePending, startRenameTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const saveName = () => {
    const trimmed = draftName.trim();
    if (!trimmed || trimmed === folder.name) {
      setDraftName(folder.name);
      setIsEditing(false);
      return;
    }
    startRenameTransition(async () => {
      const result = await renameFolder(folder.id, trimmed);
      if (result?.error) {
        toast.error(result.error);
        setDraftName(folder.name);
      }
      setIsEditing(false);
      router.refresh();
    });
  };

  const onDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteFolder(folder.id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setIsDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="glass shadow-soft rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <Folder className="size-5" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Folder actions" />}
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isEditing ? (
        <div className="mt-4 flex items-center gap-1.5">
          <Input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") {
                setDraftName(folder.name);
                setIsEditing(false);
              }
            }}
            disabled={isRenamePending}
            className="h-8 text-sm font-medium"
          />
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={saveName}
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
              setDraftName(folder.name);
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
          href={`/dashboard/folders/${folder.id}`}
          className="mt-4 block font-semibold hover:underline"
        >
          {folder.name}
        </Link>
      )}
      <p className="text-muted-foreground mt-1 text-sm">
        {count} contract{count === 1 ? "" : "s"}
      </p>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this folder?</DialogTitle>
            <DialogDescription>
              Contracts in &quot;{folder.name}&quot; will not be deleted — they&apos;ll
              just become unfiled.
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
