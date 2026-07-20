"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/shared/google-icon";
import { signInWithGoogle } from "@/app/(auth)/actions";

export function GoogleButton({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await signInWithGoogle(next);
          if (result?.error) toast.error(result.error);
        })
      }
    >
      <GoogleIcon className="size-4" />
      {pending ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
