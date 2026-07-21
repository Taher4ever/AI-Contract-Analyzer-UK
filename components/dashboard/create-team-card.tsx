"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeam } from "@/app/(app)/dashboard/team/actions";

export function CreateTeamCard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const onCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createTeam(name);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="glass shadow-soft rounded-2xl p-6">
      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
        <Users className="size-6" />
      </div>
      <h2 className="mt-4 font-semibold">Create your team</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Give it a name — you can invite colleagues once it&apos;s set up.
      </p>
      <div className="mt-4 max-w-sm">
        <Label htmlFor="team-name">Team name</Label>
        <div className="mt-1.5 flex items-center gap-2">
          <Input
            id="team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onCreate();
            }}
            disabled={isPending}
            placeholder="e.g. Acme Lettings"
          />
          <Button disabled={isPending || !name.trim()} onClick={onCreate} className="rounded-full">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
