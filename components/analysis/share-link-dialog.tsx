"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Copy, Loader2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { revokeShareLink } from "@/app/(app)/dashboard/contracts/[id]/actions";

export function ShareLinkDialog({
  contractId,
  token,
  open,
  onOpenChange,
  onRevoked,
}: {
  contractId: string;
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoked: () => void;
}) {
  const [isRevoking, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/share/${token}` : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  const onRevoke = () => {
    startTransition(async () => {
      const result = await revokeShareLink(contractId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Share link revoked.");
      onOpenChange(false);
      onRevoked();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage share link</DialogTitle>
          <DialogDescription>
            Anyone with this link can view a read-only copy of this analysis —
            no sign-in required.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={url}
            className="flex-1"
            onFocus={(e) => e.target.select()}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={copy}
            aria-label="Copy link"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button variant="destructive" disabled={isRevoking} onClick={onRevoke}>
            {isRevoking && <Loader2 className="size-4 animate-spin" />}
            Revoke link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
