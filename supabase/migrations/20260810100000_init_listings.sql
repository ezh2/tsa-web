-- ────────────────────────────────────────────────────────────────────────────
-- modules/listings · 0001_init
-- Source of truth for marketplace / sublease / carpool boards.
-- Manually copied to supabase/migrations/<timestamp>_init_listings.sql
-- until a composer exists.
-- Tables: listings_marketplace, listings_sublease, listings_carpool.
-- ────────────────────────────────────────────────────────────────────────────

create table public.listings_marketplace (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null check (length(title) between 1 and 200),
  price       text not null check (length(price) between 1 and 80),
  contact     text not null check (length(contact) between 1 and 200),
  tag         text not null default 'General' check (length(tag) between 1 and 80),
  description text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index listings_marketplace_created_at_idx
  on public.listings_marketplace (created_at desc);

create or replace function public.tg_listings_marketplace_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_marketplace_set_updated_at
  before update on public.listings_marketplace
  for each row execute function public.tg_listings_marketplace_set_updated_at();

create table public.listings_sublease (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  post_type   text not null check (post_type in ('offer', 'request')),
  title       text not null check (length(title) between 1 and 200),
  date_range  text not null check (length(date_range) between 1 and 120),
  budget      text not null default '',
  contact     text not null check (length(contact) between 1 and 200),
  details     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index listings_sublease_created_at_idx
  on public.listings_sublease (created_at desc);

create or replace function public.tg_listings_sublease_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_sublease_set_updated_at
  before update on public.listings_sublease
  for each row execute function public.tg_listings_sublease_set_updated_at();

create table public.listings_carpool (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  trip_date   date not null,
  route       text not null check (length(route) between 1 and 200),
  seats       text not null default '',
  contact     text not null check (length(contact) between 1 and 200),
  note        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index listings_carpool_trip_date_idx
  on public.listings_carpool (trip_date asc, created_at desc);

create or replace function public.tg_listings_carpool_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_carpool_set_updated_at
  before update on public.listings_carpool
  for each row execute function public.tg_listings_carpool_set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Public read. Signed-in users create their own posts. Own + directors delete.
-- ────────────────────────────────────────────────────────────────────────────
alter table public.listings_marketplace enable row level security;
alter table public.listings_sublease enable row level security;
alter table public.listings_carpool enable row level security;

create policy listings_marketplace_select_all
  on public.listings_marketplace for select
  to anon, authenticated
  using (true);

create policy listings_marketplace_insert_own
  on public.listings_marketplace for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy listings_marketplace_delete_own
  on public.listings_marketplace for delete
  to authenticated
  using (user_id = (select auth.uid()));

create policy listings_marketplace_delete_director
  on public.listings_marketplace for delete
  to authenticated
  using (public.current_user_role() = 'director');

create policy listings_sublease_select_all
  on public.listings_sublease for select
  to anon, authenticated
  using (true);

create policy listings_sublease_insert_own
  on public.listings_sublease for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy listings_sublease_delete_own
  on public.listings_sublease for delete
  to authenticated
  using (user_id = (select auth.uid()));

create policy listings_sublease_delete_director
  on public.listings_sublease for delete
  to authenticated
  using (public.current_user_role() = 'director');

create policy listings_carpool_select_all
  on public.listings_carpool for select
  to anon, authenticated
  using (true);

create policy listings_carpool_insert_own
  on public.listings_carpool for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy listings_carpool_delete_own
  on public.listings_carpool for delete
  to authenticated
  using (user_id = (select auth.uid()));

create policy listings_carpool_delete_director
  on public.listings_carpool for delete
  to authenticated
  using (public.current_user_role() = 'director');
