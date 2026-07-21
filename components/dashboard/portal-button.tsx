"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortalSession } from "@/app/(app)/dashboard/billing/actions";

export function PortalButton({
  children,
  className,
  variant = "outline",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
}) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await createPortalSession();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.url;
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={onClick}
      className={className}
    >
      {isPending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}
