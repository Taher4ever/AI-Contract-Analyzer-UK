"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, UserPlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteTeamMember, removeTeamMember } from "@/app/(app)/dashboard/team/actions";

export interface TeamMemberRow {
  id: string;
  userId: string | null;
  invitedEmail: string;
  role: "owner" | "member";
  status: "pending" | "active";
  displayName: string | null;
  avatarUrl: string | null;
}

function MemberRow({
  member,
  isOwner,
  currentUserId,
}: {
  member: TeamMemberRow;
  isOwner: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isRemoving, startTransition] = useTransition();

  const onRemove = () => {
    startTransition(async () => {
      const result = await removeTeamMember(member.id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  const initials = (member.displayName || member.invitedEmail).slice(0, 2).toUpperCase();
  const canRemove = isOwner && member.userId !== currentUserId;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
      <Avatar className="size-9">
        {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt="" />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {member.displayName || member.invitedEmail}
        </p>
        <p className="text-muted-foreground truncate text-xs">{member.invitedEmail}</p>
      </div>
      <Badge variant={member.role === "owner" ? "default" : "secondary"}>
        {member.role === "owner" ? "Owner" : "Member"}
      </Badge>
      {member.status === "pending" && <Badge variant="outline">Pending</Badge>}
      {canRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isRemoving}
          onClick={onRemove}
          aria-label="Remove member"
        >
          {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
        </Button>
      )}
    </div>
  );
}

export function TeamMembersCard({
  members,
  isOwner,
  currentUserId,
}: {
  members: TeamMemberRow[];
  isOwner: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isInviting, startTransition] = useTransition();

  const onInvite = () => {
    if (!email.trim()) return;
    startTransition(async () => {
      const result = await inviteTeamMember(email);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setEmail("");
      toast.success("Invite sent.");
      router.refresh();
    });
  };

  return (
    <div className="glass shadow-soft rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          Members <span className="text-muted-foreground font-normal">({members.length})</span>
        </h2>
      </div>

      {isOwner && (
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email.trim()) onInvite();
              }}
              disabled={isInviting}
              placeholder="colleague@company.com"
              className="pl-9"
            />
          </div>
          <Button
            disabled={isInviting || !email.trim()}
            onClick={onInvite}
            className="rounded-full"
          >
            {isInviting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Invite
          </Button>
        </div>
      )}

      <div className="mt-4 space-y-2.5">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            isOwner={isOwner}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
