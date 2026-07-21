-- Let an invited (not-yet-linked) user discover their own pending team
-- invite by email, so the dashboard can show a "you've been invited" banner
-- before they've accepted (and therefore before team_members.user_id is set).
create policy "Users can read invites addressed to their email"
  on public.team_members for select
  using (
    invited_email = (select email from public.profiles where id = auth.uid())
  );

-- Prevent a signed-in user from escalating their own plan/team/role via a
-- direct client-side profiles update (e.g. calling supabase.from('profiles')
-- .update({ plan: 'pro' }) themselves). Only the service-role client — used
-- by the Stripe webhook and the sanctioned team-invite/team-create server
-- actions — may change these columns.
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
