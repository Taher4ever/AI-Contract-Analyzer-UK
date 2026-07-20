"use client";

import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, uploadAvatar } from "@/app/(app)/dashboard/settings/actions";

const schema = z.object({
  fullName: z.string().min(1, "Please enter your name.").max(120),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({
  fullName,
  avatarUrl,
  email,
}: {
  fullName: string;
  avatarUrl: string | null;
  email: string;
}) {
  const [avatarPending, startAvatarTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateProfile(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated.");
  });

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startAvatarTransition(async () => {
      const result = await uploadAvatar(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Avatar updated.");
    });
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar size="lg">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
            <AvatarFallback>{(fullName || email).slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarPending}
            className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full"
          >
            {avatarPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Camera className="size-3" />
            )}
            <span className="sr-only">Change avatar</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>
        <div>
          <p className="font-medium">{fullName || "Add your name"}</p>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-destructive text-sm">{errors.fullName.message}</p>
          )}
        </div>
        <Button type="submit" className="rounded-full" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </div>
  );
}
