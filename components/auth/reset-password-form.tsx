"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/(auth)/actions";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // The action's redirect() must run inside a transition, not inside
  // react-hook-form's own submit promise, or the redirect gets swallowed.
  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const result = await updatePassword({ password: values.password });
      if (result?.error) {
        setRootError(result.error);
        toast.error(result.error);
      }
    });
  });

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">Choose a new password</h1>
      <p className="text-muted-foreground mt-1.5 text-center text-sm">
        Make it at least 8 characters.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {rootError && <p className="text-destructive text-sm">{rootError}</p>}

        <Button type="submit" className="w-full rounded-full" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
