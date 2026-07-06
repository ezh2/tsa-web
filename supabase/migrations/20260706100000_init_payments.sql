-- ────────────────────────────────────────────────────────────────────────────
-- modules/payments · 0001_init
-- Source of truth for the payments module schema. Manually copied to
-- supabase/migrations/<timestamp>_init_payments.sql until a composer exists.
-- Tables: payments_order, payments_stripe_event. Module prefix per CLAUDE.md §6.
--
-- Write model: rows are created and updated ONLY by the Stripe webhook handler
-- using the service role key (bypasses RLS). Authenticated users have read-only
-- access to their own orders; directors can read everything. There are
-- deliberately no insert/update/delete policies for any client role.
-- ────────────────────────────────────────────────────────────────────────────

create table public.payments_order (
  id                       uuid primary key default gen_random_uuid(),
  -- Keep the financial record even if the profile is deleted.
  user_id                  uuid references public.profiles(id) on delete set null,
  product_key              text not null,
  product_name             text not null,
  status                   text not null
                             check (status in ('processing', 'paid', 'failed', 'refunded')),
  amount_total             integer not null check (amount_total >= 0),
  currency                 text not null default 'usd',
  shirt_size               text,
  stripe_session_id        text not null unique,
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index payments_order_user_id_idx
  on public.payments_order (user_id);

create index payments_order_payment_intent_idx
  on public.payments_order (stripe_payment_intent_id);

create or replace function public.tg_payments_order_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger payments_order_set_updated_at
  before update on public.payments_order
  for each row execute function public.tg_payments_order_set_updated_at();

-- Ledger of processed Stripe webhook events. The webhook inserts the event id
-- before fulfilling; a duplicate-key failure means Stripe retried an event we
-- already handled, so the handler skips it (idempotency).
create table public.payments_stripe_event (
  id          text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- Row-Level Security — the security boundary (CLAUDE.md §7).
-- ────────────────────────────────────────────────────────────────────────────
alter table public.payments_order enable row level security;

create policy payments_order_select_own
  on public.payments_order for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy payments_order_select_director
  on public.payments_order for select
  to authenticated
  using (public.current_user_role() = 'director');

-- No insert/update/delete policies: the Stripe webhook (service role) is the
-- only writer.

alter table public.payments_stripe_event enable row level security;

-- No policies at all: clients can never read or write the webhook ledger.
