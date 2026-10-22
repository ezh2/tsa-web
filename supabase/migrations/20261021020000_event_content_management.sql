-- Editable event media, drafts, and explicit event timezones.
alter table public.events_event
  alter column created_by drop not null,
  add column is_published boolean not null default true,
  add column image_url text not null default '',
  add column link_url text not null default '',
  add column time_zone text not null default 'America/Chicago' check (time_zone in ('America/Chicago', 'Asia/Taipei', 'UTC')),
  add column time_tba boolean not null default false,
  add column time_note text not null default '',
  add column source_key text unique,
  add constraint events_event_image_url_safe check (public.content_validate_value(to_jsonb(image_url), '{"type":"string","format":"image"}'::jsonb)),
  add constraint events_event_link_url_safe check (public.content_validate_value(to_jsonb(link_url), '{"type":"string","format":"url"}'::jsonb));

-- Admins can see drafts; visitors only see published events.
alter policy events_event_select_all on public.events_event
  using ((is_published and public.content_feature_enabled('events')) or public.current_user_role() = 'admin');

-- Knowing a draft's id does not let a member RSVP to an unpublished event.
alter policy events_rsvp_insert_self_member on public.events_rsvp
  with check (user_id = (select auth.uid())
    and public.current_user_role() in ('member', 'admin')
    and public.content_feature_enabled('events')
    and exists (select 1 from public.events_event where id = event_id and is_published));
alter policy events_rsvp_update_self_member on public.events_rsvp
  with check (user_id = (select auth.uid())
    and public.current_user_role() in ('member', 'admin')
    and public.content_feature_enabled('events')
    and exists (select 1 from public.events_event where id = event_id and is_published));

-- Import the website's existing schedule once. System imports have no creator.
-- Existing database events are kept; source keys prevent repeat imports.
insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select '2026 新生說明會', 'A focused orientation for new students and parents covering arrival logistics, campus setup, housing, payments, and everyday life at UIUC. Doors open at 9:30.', '集思北科大會議中心 2F 貝塔廳', '2026-06-27T10:00:00+08:00'::timestamptz, '2026-06-27T12:00:00+08:00'::timestamptz, '/content/new-stud-oren-2627.webp', 'https://drive.google.com/file/d/1XQUzouvdKBJ9bWFAMBzvMgI-GwMjHEQn/view', 'Asia/Taipei', false, '', 'original-0'
where not exists (select 1 from public.events_event where title = '2026 新生說明會' and starts_at = '2026-06-27T10:00:00+08:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Welcome Picnic', 'A relaxed welcome event for new and returning students with organized games, conversation, and a chance to meet the TSA board before classes get busy.', 'Main Quad', '2026-08-22T16:00:00-05:00'::timestamptz, '2026-08-22T18:30:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-1'
where not exists (select 1 from public.events_event where title = 'Welcome Picnic' and starts_at = '2026-08-22T16:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'New Student Welcome Event', 'Kick off the semester over dinner at Chili Bistro! Meet fellow new students, connect with TSA members, and enjoy a relaxed evening of good food and conversation as you settle into life at UIUC.', 'Chili Bistro', '2026-08-29T20:00:00-05:00'::timestamptz, '2026-08-29T22:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-2'
where not exists (select 1 from public.events_event where title = 'New Student Welcome Event' and starts_at = '2026-08-29T20:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Night Market', 'TSA''s signature night-market experience featuring Taiwanese food, student activities, performances, and community booths inspired by Taiwan''s local markets.', 'Illini Union', '2026-09-12T18:00:00-05:00'::timestamptz, '2026-09-12T21:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-3'
where not exists (select 1 from public.events_event where title = 'Night Market' and starts_at = '2026-09-12T18:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Mid-Autumn BBQ', 'A Mid-Autumn Festival gathering with barbecue, seasonal snacks, and outdoor community time for Taiwanese students and friends of Taiwan.', 'Crystal Lake Park', '2026-09-19T17:00:00-05:00'::timestamptz, '2026-09-19T20:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-4'
where not exists (select 1 from public.events_event where title = 'Mid-Autumn BBQ' and starts_at = '2026-09-19T17:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Fall Merch Sale', 'A campus pickup and sale window for TSA merchandise, including remaining presale items and limited fall inventory while supplies last.', 'Anniversary Plaza', '2026-09-26T13:00:00-05:00'::timestamptz, '2026-09-26T16:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-5'
where not exists (select 1 from public.events_event where title = 'Fall Merch Sale' and starts_at = '2026-09-26T13:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Internal Bonding', 'A board and volunteer bonding session focused on team connection, planning alignment, and strengthening the people behind TSA events.', 'TBA', '2026-10-03T18:00:00-05:00'::timestamptz, '2026-10-03T20:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-6'
where not exists (select 1 from public.events_event where title = 'Internal Bonding' and starts_at = '2026-10-03T18:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select '1010 Party', 'A community celebration for Double Ten Day with social activities, cultural touches, and a festive space for students to gather.', 'TBA', '2026-10-10T19:00:00-05:00'::timestamptz, '2026-10-10T22:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-7'
where not exists (select 1 from public.events_event where title = '1010 Party' and starts_at = '2026-10-10T19:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Singing Contest', 'TSA''s annual performance event for student singers, featuring prepared performances, audience energy, and a supportive stage for campus talent.', 'Illini Union', '2026-11-14T20:00:00-06:00'::timestamptz, '2026-11-14T22:30:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-8'
where not exists (select 1 from public.events_event where title = 'Singing Contest' and starts_at = '2026-11-14T20:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Hot Choco Sale', 'A seasonal fundraiser offering warm drinks on campus as the weather turns cold, with proceeds supporting TSA programming.', 'Main Quad', '2026-11-20T12:00:00-06:00'::timestamptz, '2026-11-20T16:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-9'
where not exists (select 1 from public.events_event where title = 'Hot Choco Sale' and starts_at = '2026-11-20T12:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Game Day', 'A low-pressure end-of-semester hangout with board games, party games, and time to unwind before finals.', 'TBA', '2026-12-05T18:00:00-06:00'::timestamptz, '2026-12-05T21:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-10'
where not exists (select 1 from public.events_event where title = 'Game Day' and starts_at = '2026-12-05T18:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'RUFF', 'A spring welcome-back event to reconnect after winter break and ease into the new semester with TSA friends.', 'TBA', '2027-01-23T18:00:00-06:00'::timestamptz, '2027-01-23T20:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-11'
where not exists (select 1 from public.events_event where title = 'RUFF' and starts_at = '2027-01-23T18:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'New Year Banquet', 'TSA''s Lunar New Year banquet with Taiwanese cuisine, raffle prizes, and a formal community celebration for the new year.', 'Golden Harbor / 漁滿樓', '2027-02-13T18:00:00-06:00'::timestamptz, '2027-02-13T21:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-12'
where not exists (select 1 from public.events_event where title = 'New Year Banquet' and starts_at = '2027-02-13T18:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Spring Internal Bonding', 'A second-semester bonding and planning session for TSA board members, interns, and contributors.', 'TBA', '2027-02-27T18:00:00-06:00'::timestamptz, '2027-02-27T20:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-13'
where not exists (select 1 from public.events_event where title = 'Spring Internal Bonding' and starts_at = '2027-02-27T18:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Taiwanese Breakfast Pop-Up', 'A food-centered event inspired by Taiwanese breakfast shops, featuring items such as rice balls, zongzi, and classic breakfast flavors.', 'TBA', '2027-03-13T10:00:00-06:00'::timestamptz, '2027-03-13T13:00:00-06:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-14'
where not exists (select 1 from public.events_event where title = 'Taiwanese Breakfast Pop-Up' and starts_at = '2027-03-13T10:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Taiwanese Bento', 'A campus bento pickup event bringing familiar Taiwanese flavors to UIUC students through preordered meal boxes.', 'Anniversary Plaza', '2027-04-17T13:30:00-05:00'::timestamptz, '2027-04-17T16:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-15'
where not exists (select 1 from public.events_event where title = 'Taiwanese Bento' and starts_at = '2027-04-17T13:30:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Taichella', 'A TSA music party celebrating student performers, music, and community energy near the end of the academic year.', 'TBA', '2027-04-24T19:00:00-05:00'::timestamptz, '2027-04-24T22:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-16'
where not exists (select 1 from public.events_event where title = 'Taichella' and starts_at = '2027-04-24T19:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'End-of-Year Gathering', 'A closing event for the academic year with time to reflect, celebrate contributors, and send off graduating members.', 'TBA', '2027-05-01T17:00:00-05:00'::timestamptz, '2027-05-01T19:00:00-05:00'::timestamptz, '', '', 'America/Chicago', false, '', 'original-17'
where not exists (select 1 from public.events_event where title = 'End-of-Year Gathering' and starts_at = '2027-05-01T17:00:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Homecoming @RUFF', 'A partner event with WWTSA welcoming students back to TAIWAN with the most fire party at RUFF TAIPEI.', 'Partner event with WWTSA', '2026-06-29T00:00:00+08:00'::timestamptz, null, '/content/ruff0629.webp', '', 'Asia/Taipei', true, 'Time announced by WWTSA', 'original-18'
where not exists (select 1 from public.events_event where title = 'Homecoming @RUFF' and starts_at = '2026-06-29T00:00:00+08:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Taiwanese Bento', 'Enjoy a familiar Taiwanese bento on campus. Pick up your preorder at Anniversary Plaza on the Illini Union Main Quad side and bring a taste of Taiwan into your weekend.', 'Anniversary Plaza', '2026-04-18T13:30:00-05:00'::timestamptz, '2026-04-18T16:00:00-05:00'::timestamptz, '/content/bento-chicken.webp', '', 'America/Chicago', false, '', 'original-19'
where not exists (select 1 from public.events_event where title = 'Taiwanese Bento' and starts_at = '2026-04-18T13:30:00-05:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'Lunar New Year Banquet', 'Celebrate Lunar New Year with TSA at Golden Harbor. Join us for Taiwanese cuisine, time with friends, and our annual raffle draw.', 'Golden Harbor / 漁滿樓', '2026-02-14T00:00:00-06:00'::timestamptz, null, '', '', 'America/Chicago', true, 'Time announced through TSA Linktree', 'original-20'
where not exists (select 1 from public.events_event where title = 'Lunar New Year Banquet' and starts_at = '2026-02-14T00:00:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, link_url, time_zone, time_tba, time_note, source_key)
select 'TSA Singing Contest', 'Showcase your voice at the TSA Singing Contest. We are excited to welcome performers and friends for a night of music, stage energy, and community support.', 'Illini Room A', '2025-11-15T20:30:00-06:00'::timestamptz, null, '', '', 'America/Chicago', false, '', 'original-21'
where not exists (select 1 from public.events_event where title = 'TSA Singing Contest' and starts_at = '2025-11-15T20:30:00-06:00'::timestamptz)
on conflict (source_key) do nothing;

