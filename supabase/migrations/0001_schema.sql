-- Core schema for ContractLens AI.
-- Profiles and teams reference each other, so profiles.team_id's foreign
-- key is added after both tables exist.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text,
  team_id uuid,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_team_id_fkey
  foreign key (team_id) references public.teams (id) on delete set null;

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  invited_email text not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  status text not null default 'pending' check (status in ('pending', 'active')),
  created_at timestamptz not null default now(),
  unique (team_id, invited_email)
);

create table public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  folder_id uuid references public.folders (id) on delete set null,
  title text not null,
  original_filename text not null,
  file_type text not null check (file_type in ('pdf', 'docx')),
  file_path text not null,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'processing', 'analyzed', 'failed')),
  is_favorite boolean not null default false,
  paragraphs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null unique references public.contracts (id) on delete cascade,
  risk_score int check (risk_score between 0 and 100),
  summary text,
  sections jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  recommended_questions jsonb not null default '[]'::jsonb,
  model text,
  created_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  refs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.shared_links (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_id text not null,
  amount int not null,
  currency text not null default 'gbp',
  status text not null,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  published boolean not null default false,
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes on foreign keys and common lookups.
create index profiles_team_id_idx on public.profiles (team_id);
create index teams_owner_id_idx on public.teams (owner_id);
create index team_members_team_id_idx on public.team_members (team_id);
create index team_members_user_id_idx on public.team_members (user_id);
create index folders_user_id_idx on public.folders (user_id);
create index contracts_user_id_created_at_idx on public.contracts (user_id, created_at desc);
create index contracts_folder_id_idx on public.contracts (folder_id);
create index chat_messages_contract_id_idx on public.chat_messages (contract_id);
create index chat_messages_user_id_idx on public.chat_messages (user_id);
create index shared_links_contract_id_idx on public.shared_links (contract_id);
create index payments_user_id_idx on public.payments (user_id);
create index blog_posts_slug_idx on public.blog_posts (slug);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
