"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult = { error?: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createTeam(name: string): Promise<ActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Team name cannot be empty." };
  if (trimmed.length > 100) return { error: "Team name is too long." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, team_id")
    .eq("id", user.id)
    .single();
  if (profile?.plan !== "team") {
    return { error: "Upgrade to the Team plan to create a team." };
  }
  if (profile?.team_id) return { error: "You're already part of a team." };

  const admin = createAdminClient();

  const { data: team, error: teamError } = await admin
    .from("teams")
    .insert({ name: trimmed, owner_id: user.id })
    .select("id")
    .single();
  if (teamError || !team) return { error: "Could not create team." };

  const { error: memberError } = await admin.from("team_members").insert({
    team_id: team.id,
    user_id: user.id,
    invited_email: user.email ?? "",
    role: "owner",
    status: "active",
  });
  if (memberError) return { error: "Could not create team." };

  const { error: profileError } = await admin
    .from("profiles")
    .update({ team_id: team.id })
    .eq("id", user.id);
  if (profileError) return { error: "Could not create team." };

  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard");
  return {};
}

export async function inviteTeamMember(email: string): Promise<ActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return { error: "Please enter a valid email address." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!team) return { error: "Only the team owner can invite members." };

  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_id", team.id)
    .eq("invited_email", trimmed)
    .maybeSingle();
  if (existing) return { error: "This person has already been invited." };

  const { error } = await supabase.from("team_members").insert({
    team_id: team.id,
    invited_email: trimmed,
    role: "member",
    status: "pending",
  });
  if (error) return { error: "Could not send invite." };

  revalidatePath("/dashboard/team");
  return {};
}

export async function removeTeamMember(memberId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!team) return { error: "Only the team owner can remove members." };

  const { data: member } = await supabase
    .from("team_members")
    .select("id, team_id, user_id")
    .eq("id", memberId)
    .eq("team_id", team.id)
    .maybeSingle();
  if (!member) return { error: "Member not found." };
  if (member.user_id === user.id) return { error: "You can't remove yourself." };

  const admin = createAdminClient();

  if (member.user_id) {
    await admin
      .from("profiles")
      .update({ team_id: null, plan: "free" })
      .eq("id", member.user_id);
  }

  const { error } = await admin.from("team_members").delete().eq("id", memberId);
  if (error) return { error: "Could not remove member." };

  revalidatePath("/dashboard/team");
  return {};
}

export async function leaveTeam(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single();
  if (!profile?.team_id) return { error: "You're not part of a team." };

  const { data: team } = await supabase
    .from("teams")
    .select("owner_id")
    .eq("id", profile.team_id)
    .single();
  if (team?.owner_id === user.id) {
    return { error: "Team owners can't leave — delete the team instead." };
  }

  const admin = createAdminClient();

  await admin
    .from("team_members")
    .delete()
    .eq("team_id", profile.team_id)
    .eq("user_id", user.id);

  await admin.from("profiles").update({ team_id: null, plan: "free" }).eq("id", user.id);

  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard");
  return {};
}

export async function acceptTeamInvite(memberId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, team_id")
    .eq("id", user.id)
    .single();
  if (profile?.team_id) return { error: "You're already part of a team." };

  const { data: invite } = await supabase
    .from("team_members")
    .select("id, team_id, invited_email, status, user_id")
    .eq("id", memberId)
    .maybeSingle();
  if (
    !invite ||
    invite.status !== "pending" ||
    invite.user_id !== null ||
    invite.invited_email !== (profile?.email ?? user.email)
  ) {
    return { error: "This invite is no longer valid." };
  }

  const admin = createAdminClient();

  const { error: memberError } = await admin
    .from("team_members")
    .update({ user_id: user.id, status: "active" })
    .eq("id", memberId);
  if (memberError) return { error: "Could not accept invite." };

  const { error: profileError } = await admin
    .from("profiles")
    .update({ team_id: invite.team_id, plan: "team" })
    .eq("id", user.id);
  if (profileError) return { error: "Could not accept invite." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/team");
  return {};
}

export async function declineTeamInvite(memberId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const { data: invite } = await supabase
    .from("team_members")
    .select("id, invited_email, status")
    .eq("id", memberId)
    .maybeSingle();
  if (
    !invite ||
    invite.status !== "pending" ||
    invite.invited_email !== (profile?.email ?? user.email)
  ) {
    return { error: "This invite is no longer valid." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("team_members").delete().eq("id", memberId);
  if (error) return { error: "Could not decline invite." };

  revalidatePath("/dashboard");
  return {};
}
