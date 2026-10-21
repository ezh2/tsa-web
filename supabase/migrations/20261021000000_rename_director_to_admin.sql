-- Rename the existing enum value in place so existing accounts retain access.
-- PostgreSQL policies reference enum values by identity, so their comparisons
-- follow the rename without recreating policies or changing profile rows.
alter type public.role rename value 'director' to 'admin';

-- Keep policy names consistent with the new role name.
alter policy profiles_select_director on public.profiles
  rename to profiles_select_admin;

alter policy profiles_update_director on public.profiles
  rename to profiles_update_admin;

alter policy events_event_insert_director on public.events_event
  rename to events_event_insert_admin;

alter policy events_event_update_director on public.events_event
  rename to events_event_update_admin;

alter policy events_event_delete_director on public.events_event
  rename to events_event_delete_admin;

alter policy events_rsvp_select_director on public.events_rsvp
  rename to events_rsvp_select_admin;

alter policy payments_order_select_director on public.payments_order
  rename to payments_order_select_admin;

alter policy listings_marketplace_delete_director on public.listings_marketplace
  rename to listings_marketplace_delete_admin;

alter policy listings_sublease_delete_director on public.listings_sublease
  rename to listings_sublease_delete_admin;

alter policy listings_carpool_delete_director on public.listings_carpool
  rename to listings_carpool_delete_admin;
