-- Respect website feature switches for direct Supabase clients.
alter policy listings_marketplace_select_all on public.listings_marketplace
  using (public.content_feature_enabled('marketplace') or public.current_user_role() = 'admin');
alter policy listings_marketplace_insert_own on public.listings_marketplace
  with check (user_id = (select auth.uid()) and public.content_feature_enabled('marketplace'));
alter policy listings_sublease_select_all on public.listings_sublease
  using (public.content_feature_enabled('sublease') or public.current_user_role() = 'admin');
alter policy listings_sublease_insert_own on public.listings_sublease
  with check (user_id = (select auth.uid()) and public.content_feature_enabled('sublease'));
alter policy listings_carpool_select_all on public.listings_carpool
  using (public.content_feature_enabled('carpool') or public.current_user_role() = 'admin');
alter policy listings_carpool_insert_own on public.listings_carpool
  with check (user_id = (select auth.uid()) and public.content_feature_enabled('carpool'));
