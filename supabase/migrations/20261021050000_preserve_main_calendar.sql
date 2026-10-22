-- Keep main's calendar, event details and complete photo galleries editable.
alter table public.events_event
  add column image_gallery jsonb not null default '[]'::jsonb,
  add column show_in_archive boolean not null default true,
  add constraint events_event_gallery_safe check (
    jsonb_array_length(image_gallery) <= 20
    and public.content_validate_value(image_gallery,
      '{"type":"array","item":{"type":"object","fields":{"src":{"type":"string","format":"image","required":true},"alt":{"type":"string"}}}}'::jsonb)
  );

-- Retire only untouched entries from the older seed that are absent from main.
-- Keep the rows and their RSVP history instead of deleting user data.
update public.events_event set is_published = false
where source_key in ('original-3', 'original-5', 'original-6', 'original-13')
  and created_by is null and updated_at = created_at and is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('2026 新生說明會', 'A focused orientation for new students and parents covering arrival logistics, campus setup, housing, payments, and everyday life at UIUC. Doors open at 9:30.', '集思北科大會議中心 2F 貝塔廳', '2026-06-27T02:00:00.000Z', '2026-06-27T04:00:00.000Z', '/content/new-stud-oren-2627.png', '[{"src":"/content/new-stud-oren-2627.png","alt":"2026 TSA UIUC new student orientation flyer"}]'::jsonb, 'https://drive.google.com/file/d/1XQUzouvdKBJ9bWFAMBzvMgI-GwMjHEQn/view', 'Asia/Taipei', false, '', true, 'original-0')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Welcome Picnic', 'A relaxed welcome event for new and returning students with organized games, conversation, and a chance to meet the TSA board before classes get busy.', 'Main Quad', '2026-08-22T21:00:00.000Z', '2026-08-22T23:30:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', false, 'original-1')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('New Student Welcome Event', 'Kick off the semester over dinner at Chili Bistro! Meet fellow new students, connect with TSA members, and enjoy a relaxed evening of good food and conversation as you settle into life at UIUC.', 'Chili Bistro', '2026-08-30T01:00:00.000Z', '2026-08-30T03:00:00.000Z', '/content/welcome-dinner.jpg', '[{"src":"/content/welcome-dinner.jpg","alt":"TSA UIUC new student welcome dinner"}]'::jsonb, '', 'America/Chicago', false, '', true, 'original-2')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('General Meeting', 'An interns-only TSA general meeting. Please bring your i-card. Follow Instagram for the latest details.', 'AACC', '2026-09-20T18:00:00.000Z', '2026-09-20T19:00:00.000Z', '/content/general-meeting-2627.jpg', '[{"src":"/content/general-meeting-2627.jpg","alt":"TSA UIUC General Meeting"}]'::jsonb, '', 'America/Chicago', false, '', true, 'main-general-meeting')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('超可盃 籃球', 'A TSA basketball activity. Follow Instagram for the latest schedule and sign-up details.', 'ARC Gym 1, Court 5-6', '2026-09-26T16:30:00.000Z', '2026-09-26T21:30:00.000Z', '/content/super-ok.jpg', '[{"src":"/content/super-ok.jpg","alt":"TSA UIUC 超可盃 basketball event"}]'::jsonb, '', 'America/Chicago', false, '', true, 'main-basketball')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('中秋烤肉', 'A Mid-Autumn Festival barbecue gathering. Follow Instagram for the latest ticket details.', 'Crystal Lake Park', '2026-09-27T16:30:00.000Z', null, '/content/img-4378.jpeg', '[{"src":"/content/img-4378.jpeg","alt":"TSA UIUC Mid-Autumn BBQ group photo"},{"src":"/content/img-4786.jpeg","alt":"TSA UIUC Mid-Autumn BBQ food and picnic setup"},{"src":"/content/img-4795.jpeg","alt":"TSA UIUC Mid-Autumn BBQ students at Crystal Lake Park"}]'::jsonb, 'https://forms.gle/3EQo4LgSNydndDrr6', 'America/Chicago', false, '', true, 'original-4')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('National Day Celebration', 'A community celebration for Double Ten Day with social activities, cultural touches, and a festive space for students to gather. Follow Instagram for details.', 'Joe''s Brewery Champaign', '2026-10-11T03:30:00.000Z', null, '/content/10-10.jpg', '[{"src":"/content/10-10.jpg","alt":"TSA UIUC National Day Celebration"}]'::jsonb, '', 'America/Chicago', false, '', true, 'original-7')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('TASC 10/10 Night Market', 'A 10/10 night activity with TASC. Follow Instagram for the latest details.', 'TASC Night Market, booth location TBA', '2026-10-10T22:30:00.000Z', null, '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'main-tasc-night-market')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Singing Contest', 'TSA''s annual performance event for student singers, featuring prepared performances, audience energy, and a supportive stage for campus talent.', 'Illini Union', '2026-11-15T02:00:00.000Z', '2026-11-15T04:30:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-8')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Hot Choco Sale', 'A seasonal fundraiser offering warm drinks on campus as the weather turns cold, with proceeds supporting TSA programming.', 'Main Quad', '2026-11-20T18:00:00.000Z', '2026-11-20T22:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-9')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Game Day', 'A low-pressure end-of-semester hangout with board games, party games, and time to unwind before finals.', 'TBA', '2026-12-06T00:00:00.000Z', '2026-12-06T03:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-10')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('RUFF', 'A spring welcome-back event to reconnect after winter break and ease into the new semester with TSA friends.', 'TBA', '2027-01-24T00:00:00.000Z', '2027-01-24T02:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-11')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('New Year Banquet', 'TSA''s Lunar New Year banquet with Taiwanese cuisine, raffle prizes, and a formal community celebration for the new year.', 'Golden Harbor / 漁滿樓', '2027-02-14T00:00:00.000Z', '2027-02-14T03:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-12')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Taiwanese Breakfast Pop-Up', 'A food-centered event inspired by Taiwanese breakfast shops, featuring items such as rice balls, zongzi, and classic breakfast flavors.', 'TBA', '2027-03-13T16:00:00.000Z', '2027-03-13T19:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-14')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Taiwanese Bento', 'A campus bento pickup event bringing familiar Taiwanese flavors to UIUC students through preordered meal boxes.', 'Anniversary Plaza', '2027-04-17T18:30:00.000Z', '2027-04-17T21:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-15')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Taichella', 'A TSA music party celebrating student performers, music, and community energy near the end of the academic year.', 'TBA', '2027-04-25T00:00:00.000Z', '2027-04-25T03:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-16')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('End-of-Year Gathering', 'A closing event for the academic year with time to reflect, celebrate contributors, and send off graduating members.', 'TBA', '2027-05-01T22:00:00.000Z', '2027-05-02T00:00:00.000Z', '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-17')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Homecoming @RUFF', null, 'Partner event with WWTSA', '2026-06-28T16:00:00.000Z', null, '/content/ruff0629.jpg', '[{"src":"/content/ruff0629.jpg","alt":"Homecoming at RUFF partner event flyer"}]'::jsonb, '', 'Asia/Taipei', true, 'Time announced by WWTSA', true, 'original-18')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Taiwanese Bento', null, 'Anniversary Plaza', '2026-04-18T18:30:00.000Z', '2026-04-18T21:00:00.000Z', '/content/bento-2526.jpg', '[{"src":"/content/bento-2526.jpg","alt":"TSA UIUC Taiwanese bento event"}]'::jsonb, '', 'America/Chicago', false, '', true, 'original-19')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('Lunar New Year Banquet', null, 'Golden Harbor / 漁滿樓', '2026-02-14T06:00:00.000Z', null, '', '[]'::jsonb, '', 'America/Chicago', true, 'Time announced through TSA Linktree', true, 'original-20')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

insert into public.events_event (title, description, location, starts_at, ends_at, image_url, image_gallery, link_url, time_zone, time_tba, time_note, show_in_archive, source_key)
values ('TSA Singing Contest', null, 'Illini Room A', '2025-11-16T02:30:00.000Z', null, '', '[]'::jsonb, '', 'America/Chicago', false, '', true, 'original-21')
on conflict (source_key) do update set
  title = excluded.title,
  description = excluded.description,
  location = excluded.location,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  image_url = excluded.image_url,
  image_gallery = excluded.image_gallery,
  link_url = excluded.link_url,
  time_zone = excluded.time_zone,
  time_tba = excluded.time_tba,
  time_note = excluded.time_note,
  show_in_archive = excluded.show_in_archive
where events_event.created_by is null and events_event.updated_at = events_event.created_at and events_event.is_published;

