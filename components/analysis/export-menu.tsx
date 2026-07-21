"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog";
import { ShareLinkDialog } from "./share-link-dialog";
import { createShareLink } from "@/app/(app)/dashboard/contracts/[id]/actions";
import type { Plan } from "@/types/database";

export function ExportMenu({
  contractId,
  plan,
  initialShareToken,
}: {
  contractId: string;
  plan: Plan;
  initialShareToken: string | null;
}) {
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [isCreating, setIsCreating] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const onCopyShareLink = async () => {
    if (plan === "free") {
      setUpgradeOpen(true);
      return;
    }
    setIsCreating(true);
    const result = await createShareLink(contractId);
    setIsCreating(false);

    if (!result.success) {
      if (result.code === "pro_required") setUpgradeOpen(true);
      else toast.error(result.error);
      return;
    }

    setShareToken(result.token);
    const url = `${window.location.origin}/share/${result.token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard.", {
        action: { label: "Manage", onClick: () => setManageOpen(true) },
      });
    } catch {
      toast.success("Share link created.", {
        action: { label: "Manage", onClick: () => setManageOpen(true) },
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="rounded-full" />}
        >
          <Download className="size-4" />
          Export
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<a href={`/api/export/pdf/${contractId}`} download />}
          >
            <FileText className="size-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<a href={`/api/export/docx/${contractId}`} download />}
          >
            <FileText className="size-4" />
            Download Word
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isCreating} onClick={onCopyShareLink}>
            <Share2 className="size-4" />
            Copy share link
          </DropdownMenuItem>
          {shareToken && (
            <DropdownMenuItem onClick={() => setManageOpen(true)}>
              <Share2 className="size-4" />
              Manage share link
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        title="Share links are a Pro feature"
        description="Upgrade to Pro to create a public, read-only share link for this analysis."
      />

      {shareToken && (
        <ShareLinkDialog
          contractId={contractId}
          token={shareToken}
          open={manageOpen}
          onOpenChange={setManageOpen}
          onRevoked={() => setShareToken(null)}
        />
      )}
    </>
  );
}
