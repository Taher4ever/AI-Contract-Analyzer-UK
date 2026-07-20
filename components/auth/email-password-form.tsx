"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, signUp } from "@/app/(auth)/actions";
import { CheckInbox } from "@/components/auth/check-inbox";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof loginSchema>;

export function EmailPasswordForm({
  mode,
  next,
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const [rootError, setRootError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
  });

  if (successMessage) return <CheckInbox message={successMessage} />;

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    const result =
      mode === "login"
        ? await signInWithPassword({ ...values, next })
        : await signUp(values);

    if (result?.error) {
      setRootError(result.error);
      toast.error(result.error);
      return;
    }
    if (result?.success) {
      setSuccessMessage(result.message ?? "Check your inbox.");
      toast.success(result.message ?? "Check your inbox.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "login" && (
            <Link
              href="/forgot-password"
              className="text-primary text-xs font-medium hover:underline"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <Input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      {rootError && <p className="text-destructive text-sm">{rootError}</p>}

      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
