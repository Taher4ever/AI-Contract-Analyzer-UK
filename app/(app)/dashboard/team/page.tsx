import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateTeamCard } from "@/components/dashboard/create-team-card";
import { TeamMembersCard, type TeamMemberRow } from "@/components/dashboard/team-members-card";
import { LeaveTeamCard } from "@/components/dashboard/leave-team-card";
import { TeamContractRow } from "@/components/dashboard/team-contract-row";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, team_id")
    .eq("id", user.id)
    .single();

  if (profile?.plan !== "team") {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold">Team</h1>
        <div className="glass shadow-soft mt-6 rounded-2xl">
          <EmptyState
            icon={Users}
            title="Team plan required"
            description="Upgrade to the Team plan to create a shared workspace with your colleagues."
            actionLabel="View plans"
            actionHref="/dashboard/billing"
          />
        </div>
      </div>
    );
  }

  if (!profile.team_id) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold">Team</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create a team to share contracts with your colleagues.
        </p>
        <div className="mt-6">
          <CreateTeamCard />
        </div>
      </div>
    );
  }

  const [{ data: team }, { data: members }] = await Promise.all([
    supabase.from("teams").select("id, name, owner_id").eq("id", profile.team_id).single(),
    supabase
      .from("team_members")
      .select("id, user_id, invited_email, role, status")
      .eq("team_id", profile.team_id)
      .order("created_at", { ascending: true }),
  ]);

  if (!team) redirect("/dashboard");

  const isOwner = team.owner_id === user.id;
  const memberUserIds = (members ?? [])
    .map((m) => m.user_id)
    .filter((id): id is string => !!id);

  const { data: memberProfiles } =
    memberUserIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", memberUserIds)
      : { data: [] };

  const memberRows: TeamMemberRow[] = (members ?? []).map((m) => {
    const p = memberProfiles?.find((mp) => mp.id === m.user_id);
    return {
      id: m.id,
      userId: m.user_id,
      invitedEmail: m.invited_email,
      role: m.role,
      status: m.status,
      displayName: p?.full_name ?? null,
      avatarUrl: p?.avatar_url ?? null,
    };
  });

  const { data: teamContracts } = await supabase
    .from("contracts")
    .select("id, title, status, created_at, user_id")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });

  const uploaderNameById = new Map(
    memberRows.map((m) => [m.userId, m.displayName || m.invitedEmail])
  );

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">{team.name}</h1>
      <p className="text-muted-foreground mt-1 text-sm">Your shared team workspace.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TeamMembersCard members={memberRows} isOwner={isOwner} currentUserId={user.id} />
        {!isOwner && <LeaveTeamCard teamName={team.name} />}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Team contracts</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Contracts uploaded by your teammates (read-only).
        </p>
        <div className="mt-4 space-y-3">
          {(teamContracts ?? []).length === 0 ? (
            <div className="glass shadow-soft rounded-2xl">
              <EmptyState
                icon={Users}
                title="No team contracts yet"
                description="When teammates upload contracts, they'll show up here."
              />
            </div>
          ) : (
            teamContracts!.map((c) => (
              <TeamContractRow
                key={c.id}
                title={c.title}
                status={c.status}
                createdAt={c.created_at}
                uploaderName={uploaderNameById.get(c.user_id) ?? "a teammate"}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
