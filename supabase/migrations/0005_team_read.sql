-- Team members can read (but not modify) contracts belonging to any other
-- active member of the same team. Requires the team owner to also have an
-- active team_members row for their own team (see app/(app)/dashboard/team
-- actions), so ownership and membership share one lookup path.

create policy "Team members can read team contracts"
  on public.contracts for select
  using (
    exists (
      select 1
      from public.team_members mine
      join public.team_members theirs on theirs.team_id = mine.team_id
      where mine.user_id = auth.uid()
        and mine.status = 'active'
        and theirs.user_id = contracts.user_id
        and theirs.status = 'active'
    )
  );
