-- ────────────────────────────────────────────────────────────────────────────
-- Pre-launch cleanup — run in Supabase Studio SQL Editor on the PROD project.
-- Run the REVIEW queries first. Only then uncomment and run the DELETE block.
-- Do this ONCE, right before real members start signing up / paying.
-- ────────────────────────────────────────────────────────────────────────────

-- ── REVIEW 1: all user accounts. Decide which are test accounts. ────────────
select p.id, p.email, p.role, p.display_name, p.created_at
from public.profiles p
order by p.created_at;

-- ── REVIEW 2: all orders (sandbox test orders have fake Stripe ids). ────────
select id, product_key, status, amount_total, stripe_session_id, created_at
from public.payments_order
order by created_at;

-- ── DELETE block: uncomment, EDIT THE EMAIL LIST, then run. ──────────────────
-- Deleting from auth.users cascades to profiles, events_rsvp, and sets
-- payments_order.user_id to null.
--
-- begin;
--
-- -- 1. Sandbox-era payment data (all of it predates real sales):
-- delete from public.payments_order;
-- delete from public.payments_stripe_event;
--
-- -- 2. Test users — EDIT this list; NEVER include real board members
-- --    unless they want a fresh start:
-- delete from auth.users
-- where email in (
--   'burtontest@illinois.edu'      -- <-- replace with the real test emails
-- );
--
-- commit;

-- ── AFTER: re-grant director to real board accounts if affected ─────────────
-- update public.profiles set role = 'director' where email = 'burtonw2@illinois.edu';
