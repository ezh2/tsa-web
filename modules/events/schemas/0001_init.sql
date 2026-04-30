-- ────────────────────────────────────────────────────────────────────────────
-- modules/events · 0001_init
-- Source of truth for the events module schema. Manually copied to
-- supabase/migrations/<timestamp>_init_events.sql until a composer exists.
-- Tables: events_event, events_rsvp. Module prefix per CLAUDE.md §6.
-- ────────────────────────────────────────────────────────────────────────────

create table public.events_event (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(title) between 1 and 200),
  description text,
  location    text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  capacity    integer check (capacity is null or capacity > 0),
  created_by  uuid not null references public.profiles(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create index events_event_starts_at_idx on public.events_event (starts_at);

create or replace function public.tg_events_event_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger events_event_set_updated_at
  before update on public.events_event
  for each row execute function public.tg_events_event_set_updated_at();

create table public.events_rsvp (
  event_id   uuid not null references public.events_event(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  status     text not null check (status in ('going', 'maybe')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index events_rsvp_user_id_idx on public.events_rsvp (user_id);

create or replace function public.tg_events_rsvp_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger events_rsvp_set_updated_at
  before update on public.events_rsvp
  for each row execute function public.tg_events_rsvp_set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- Row-Level Security — the security boundary (CLAUDE.md §7).
-- ────────────────────────────────────────────────────────────────────────────
alter table public.events_event enable row level security;

create policy events_event_select_all
  on public.events_event for select
  to anon, authenticated
  using (true);

create policy events_event_insert_director
  on public.events_event for insert
  to authenticated
  with check (
    public.current_user_role() = 'director'
    and created_by = (select auth.uid())
  );

create policy events_event_update_director
  on public.events_event for update
  to authenticated
  using (public.current_user_role() = 'director')
  with check (public.current_user_role() = 'director');

create policy events_event_delete_director
  on public.events_event for delete
  to authenticated
  using (public.current_user_role() = 'director');

alter table public.events_rsvp enable row level security;

create policy events_rsvp_select_own
  on public.events_rsvp for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy events_rsvp_select_director
  on public.events_rsvp for select
  to authenticated
  using (public.current_user_role() = 'director');

create policy events_rsvp_insert_self_member
  on public.events_rsvp for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and public.current_user_role() in ('member', 'director')
  );

create policy events_rsvp_update_self_member
  on public.events_rsvp for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and public.current_user_role() in ('member', 'director')
  );

create policy events_rsvp_delete_self
  on public.events_rsvp for delete
  to authenticated
  using (user_id = (select auth.uid()));
