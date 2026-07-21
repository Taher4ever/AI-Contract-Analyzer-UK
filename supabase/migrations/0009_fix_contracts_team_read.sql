-- The "Team members can read team contracts" policy from 0005 joins
-- team_members to itself inside its USING clause. That subquery is itself
-- subject to team_members' own RLS from the calling (non-owner) member's
-- perspective, which only grants visibility into their own membership row —
-- so the join to the contract owner's team_members row silently returns
-- nothing. Same root cause and fix as 0007: move the cross-row check into a
-- SECURITY DEFINER helper function so it runs with the function owner's
-- privileges and doesn't get filtered by team_members' RLS internally.

create or replace function public.in_same_active_team(other_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.team_members mine
    join public.team_members theirs on theirs.team_id = mine.team_id
    where mine.user_id = auth.uid()
      and mine.status = 'active'
      and theirs.user_id = other_user_id
      and theirs.status = 'active'
  );
$$;

drop policy if exists "Team members can read team contracts" on public.contracts;
create policy "Team members can read team contracts"
  on public.contracts for select
  using (public.in_same_active_team(user_id));
