"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/app/(auth)/actions";
import { CheckInbox } from "@/components/auth/check-inbox";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (successMessage) return <CheckInbox message={successMessage} />;

  const onSubmit = handleSubmit(async (values) => {
    const result = await requestPasswordReset(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.success) {
      setSuccessMessage(result.message ?? "Check your inbox.");
      toast.success(result.message ?? "Check your inbox.");
    }
  });

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">Reset your password</h1>
      <p className="text-muted-foreground mt-1.5 text-center text-sm">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
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

        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="size-3.5" />
          Back to login
        </Link>
      </p>
    </div>
  );
}
