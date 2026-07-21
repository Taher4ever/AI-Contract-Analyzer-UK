"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { leaveTeam } from "@/app/(app)/dashboard/team/actions";

export function LeaveTeamCard({ teamName }: { teamName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onLeave = () => {
    startTransition(async () => {
      const result = await leaveTeam();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
    });
  };

  return (
    <div className="glass shadow-soft rounded-2xl p-6">
      <h2 className="font-semibold">Leave team</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        You&apos;ll lose access to {teamName}&apos;s shared contracts and move back to the Free plan.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="destructive" className="mt-4 rounded-full" />}>
          <LogOut className="size-4" />
          Leave team
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave {teamName}?</DialogTitle>
            <DialogDescription>
              You&apos;ll no longer see this team&apos;s shared contracts, and your
              plan will revert to Free. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" disabled={isPending} onClick={onLeave}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Yes, leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
