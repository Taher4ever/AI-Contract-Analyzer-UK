"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reanalyzeContract } from "@/app/(app)/dashboard/contracts/[id]/actions";

export function ReanalyzeButton({
  contractId,
  label = "Re-analyze",
}: {
  contractId: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await reanalyzeContract(contractId);
          if (result?.error) toast.error(result.error);
        })
      }
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RotateCw className="size-4" />
      )}
      {label}
    </Button>
  );
}
