-- Fix a circular RLS reference between `teams` and `team_members` that has
-- existed since the original schema (0001/0002): teams' SELECT policy reads
-- team_members, and team_members' SELECT policy reads teams. This didn't
-- surface as an error until Phase 13 exercised team_members queries from a
-- non-owner session for the first time. The standard fix is to move the
-- cross-table checks into SECURITY DEFINER helper functions, which run with
-- the function owner's privileges and so don't re-trigger RLS on the table
-- they query — breaking the cycle.

create or replace function public.owns_team(check_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.teams
    where id = check_team_id and owner_id = auth.uid()
  );
$$;

create or replace function public.is_active_team_member(check_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.team_members
    where team_id = check_team_id and user_id = auth.uid() and status = 'active'
  );
$$;

drop policy if exists "Owners can read own team" on public.teams;
create policy "Owners can read own team"
  on public.teams for select
  using (owner_id = auth.uid() or public.is_active_team_member(id));

drop policy if exists "Members can read own membership" on public.team_members;
create policy "Members can read own membership"
  on public.team_members for select
  using (user_id = auth.uid() or public.owns_team(team_id));

drop policy if exists "Owners can manage team members" on public.team_members;
create policy "Owners can manage team members"
  on public.team_members for all
  using (public.owns_team(team_id))
  with check (public.owns_team(team_id));

-- Re-assert the profile-privilege-escalation trigger from 0006 in case it
-- did not take effect the first time (idempotent: safe to run again).
create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if new.plan is distinct from old.plan
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.team_id is distinct from old.team_id
    or new.role is distinct from old.role
  then
    raise exception 'Cannot modify protected profile fields directly.';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_privilege_escalation on public.profiles;
create trigger profiles_prevent_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_profile_privilege_escalation();
