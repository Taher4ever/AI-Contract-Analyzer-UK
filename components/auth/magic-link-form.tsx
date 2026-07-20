"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithMagicLink } from "@/app/(auth)/actions";
import { CheckInbox } from "@/components/auth/check-inbox";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function MagicLinkForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (successMessage) return <CheckInbox message={successMessage} />;

  const onSubmit = handleSubmit(async (values) => {
    const result = await signInWithMagicLink(values);
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
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
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
        Email me a magic link
      </Button>
    </form>
  );
}
