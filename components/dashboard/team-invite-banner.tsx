"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptTeamInvite, declineTeamInvite } from "@/app/(app)/dashboard/team/actions";

export function TeamInviteBanner({
  memberId,
  teamName,
}: {
  memberId: string;
  teamName: string;
}) {
  const router = useRouter();
  const [isAccepting, startAcceptTransition] = useTransition();
  const [isDeclining, startDeclineTransition] = useTransition();

  const onAccept = () => {
    startAcceptTransition(async () => {
      const result = await acceptTeamInvite(memberId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`You've joined ${teamName}.`);
      router.refresh();
    });
  };

  const onDecline = () => {
    startDeclineTransition(async () => {
      const result = await declineTeamInvite(memberId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  const isPending = isAccepting || isDeclining;

  return (
    <div className="glass shadow-soft-lg flex flex-wrap items-center gap-4 rounded-2xl p-5">
      <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
        <Users className="size-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">You&apos;ve been invited to join {teamName}</p>
        <p className="text-muted-foreground text-sm">
          Accepting moves you to the Team plan and shares your contracts with the team.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" className="rounded-full" disabled={isPending} onClick={onDecline}>
          {isDeclining && <Loader2 className="size-4 animate-spin" />}
          Decline
        </Button>
        <Button className="rounded-full" disabled={isPending} onClick={onAccept}>
          {isAccepting && <Loader2 className="size-4 animate-spin" />}
          Accept
        </Button>
      </div>
    </div>
  );
}
