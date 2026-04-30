-- ────────────────────────────────────────────────────────────────────────────
-- TSA Platform · Core profiles + RBAC infrastructure
-- This is the security boundary for all modules (CLAUDE.md §7).
-- ────────────────────────────────────────────────────────────────────────────

create type public.role as enum ('customer', 'member', 'director');

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  role         public.role not null default 'customer',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.tg_profiles_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_profiles_set_updated_at();

create or replace function public.tg_auth_user_create_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger auth_user_created_profile
  after insert on auth.users
  for each row execute function public.tg_auth_user_create_profile();

-- SECURITY DEFINER role lookup — avoids RLS recursion inside policies on profiles.
create or replace function public.current_user_role()
returns public.role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to anon, authenticated;

-- ────────────────────────────────────────────────────────────────────────────
-- Row-Level Security — the security boundary.
-- ────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_select_director
  on public.profiles
  for select
  to authenticated
  using (public.current_user_role() = 'director');

-- Users can edit their own profile but cannot escalate their role.
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and role = public.current_user_role()
  );

create policy profiles_update_director
  on public.profiles
  for update
  to authenticated
  using (public.current_user_role() = 'director')
  with check (public.current_user_role() = 'director');

-- No INSERT policy: rows are created only by the SECURITY DEFINER auth trigger.
-- No DELETE policy: rows are removed only by cascade from auth.users deletion.
