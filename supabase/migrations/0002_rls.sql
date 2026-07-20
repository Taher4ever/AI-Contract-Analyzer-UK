-- Row Level Security: owners CRUD their own data; team members can read
-- their team; blog posts are publicly readable when published. All admin
-- operations go through the service-role client and bypass RLS, so no
-- admin-specific policies are defined here.

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.folders enable row level security;
alter table public.contracts enable row level security;
alter table public.analyses enable row level security;
alter table public.chat_messages enable row level security;
alter table public.shared_links enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.blog_posts enable row level security;

-- profiles: users can read and update their own profile.
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- teams: owners have full control; members can read teams they belong to.
create policy "Owners can read own team"
  on public.teams for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.team_members tm
      where tm.team_id = teams.id
        and tm.user_id = auth.uid()
        and tm.status = 'active'
    )
  );

create policy "Owners can create teams"
  on public.teams for insert
  with check (owner_id = auth.uid());

create policy "Owners can update own team"
  on public.teams for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners can delete own team"
  on public.teams for delete
  using (owner_id = auth.uid());

-- team_members: members can read their own membership; owners manage all
-- memberships of the teams they own.
create policy "Members can read own membership"
  on public.team_members for select
  using (
    user_id = auth.uid()
    or team_id in (select id from public.teams where owner_id = auth.uid())
  );

create policy "Owners can manage team members"
  on public.team_members for all
  using (team_id in (select id from public.teams where owner_id = auth.uid()))
  with check (team_id in (select id from public.teams where owner_id = auth.uid()));

-- folders: owner CRUD.
create policy "Users can manage own folders"
  on public.folders for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- contracts: owner CRUD.
create policy "Users can manage own contracts"
  on public.contracts for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- analyses: owner CRUD via contract ownership.
create policy "Users can manage own analyses"
  on public.analyses for all
  using (
    contract_id in (select id from public.contracts where user_id = auth.uid())
  )
  with check (
    contract_id in (select id from public.contracts where user_id = auth.uid())
  );

-- chat_messages: owner CRUD.
create policy "Users can manage own chat messages"
  on public.chat_messages for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- shared_links: owner CRUD via contract ownership.
create policy "Users can manage own shared links"
  on public.shared_links for all
  using (
    contract_id in (select id from public.contracts where user_id = auth.uid())
  )
  with check (
    contract_id in (select id from public.contracts where user_id = auth.uid())
  );

-- subscriptions: read-only for the owning user; writes go through the
-- Stripe webhook using the service-role client.
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (user_id = auth.uid());

-- payments: read-only for the owning user.
create policy "Users can read own payments"
  on public.payments for select
  using (user_id = auth.uid());

-- blog_posts: public read of published posts; writes go through the admin
-- panel using the service-role client.
create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (published = true);
