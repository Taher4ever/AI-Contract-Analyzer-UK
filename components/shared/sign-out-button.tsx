"use client";

import { useTransition } from "react";
import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

export function SignOutButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        startTransition(() => signOut());
      }}
      {...props}
    />
  );
}
