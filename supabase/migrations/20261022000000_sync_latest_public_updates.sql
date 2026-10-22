update public.content_definition
set definition = jsonb_set(
  definition,
  '{fields,partners,item,fields,venues}',
  '{"label":"Venues","type":"array","item":{"label":"Venue","type":"object","fields":{"name":{"label":"Name","type":"string","required":true},"address":{"label":"Address","type":"string"},"logo":{"label":"Logo","type":"string","format":"image"}}}}'::jsonb
)
where key = 'membership';

update public.content_document
set body = jsonb_set(
  body,
  '{socialLinks,0,href}',
  '"https://www.instagram.com/tsa_uiuc/"'::jsonb
)
where key = 'site';

update public.content_document
set body = jsonb_set(
  body,
  '{sponsors}',
  '[
    {"name":"TSMC (台灣積體電路製造)","logo":"/content/tsmc-logo.png"},
    {"name":"LaTea","logo":"/content/latea-logo.png"},
    {"name":"Weee","logo":"/content/weee-logo.png"},
    {"name":"Taipei Economics Cultural Office Chicago","logo":"/content/roc-flag.webp"},
    {"name":"bb.q Chicken","logo":"/content/bbq-chicken-logo.png"},
    {"name":"Pokelab","logo":"/content/pokelab-logo.jpeg"},
    {"name":"SGD Dubu","logo":"/content/sgd-logo.jpeg"},
    {"name":"Susuru Ramen","logo":"/content/susuru-ramen-logo.jpeg"}
  ]'::jsonb
)
where key = 'about';

update public.content_document
set body = jsonb_set(
  jsonb_set(
    jsonb_set(
      body,
      '{partners}',
      '[
        {"category":"Restaurant","name":"Restaurant Partners","offer":"10% off in-person purchases with a subtotal of $20 or more before tax and tip. Available for dine-in and in-store takeout starting October 23, 2026.","href":"","additionalOffer":"Show a valid physical or digital TSA membership card when requesting the discount. Not valid for delivery apps or online orders. Cannot be combined with other discounts or promotions; limit one discount per bill.","address":"","confirmed":true,"logo":"","venues":[
          {"name":"SGD Dubu","address":"707 S Sixth St, Champaign","logo":"/content/sgd-logo.jpeg"},
          {"name":"bb.q Chicken","address":"700 S Gregory St, Urbana","logo":"/content/bbq-chicken-logo.png"},
          {"name":"Pokelab","address":"605 S Sixth St, Champaign","logo":"/content/pokelab-logo.jpeg"},
          {"name":"Susuru Ramen","address":"621 E Green St, Champaign","logo":"/content/susuru-ramen-logo.jpeg"}
        ]},
        {"category":"Beverages","name":"LaTea","offer":"10% off in-store at LaTea (regular-priced drinks only). Cannot be combined with other discounts or promotions.","href":"","additionalOffer":"Early access to seasonal drinks and new product launches.","address":"601 S 6th St Apt 105, Champaign, IL 61820","confirmed":true,"logo":"/content/latea-logo.png","venues":[]},
        {"category":"Restaurant","name":"Golden Harbor 漁滿樓","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":"","venues":[]},
        {"category":"Restaurant","name":"PHO Noodle Station","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":"","venues":[]},
        {"category":"Restaurant","name":"Paris Super","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":"","venues":[]},
        {"category":"Beverages","name":"HAPPYLEMON","offer":"To be announced","href":"https://www.google.com/maps","additionalOffer":"","address":"","confirmed":false,"logo":"","venues":[]},
        {"category":"Groceries","name":"Weee","offer":"To be announced","href":"https://www.sayweee.com/","additionalOffer":"","address":"","confirmed":false,"logo":"","venues":[]}
      ]'::jsonb
    ),
    '{features}',
    '["Lifetime TSA membership","Non-transferable membership holder benefits","Partner discounts at LaTea and participating restaurants","Membership card and Line Announcement System enrollment","Membership card discounts cannot be combined with other event discounts"]'::jsonb
  ),
  '{pricingPlans,0,body}',
  '"TSA membership plus one T-shirt Merch Bundle. Bundle price applies to one T-shirt only."'::jsonb
)
where key = 'membership';

update public.content_document
set body = jsonb_set(body, '{purchaseUrl}', '"https://www.instagram.com/tsa_uiuc/"'::jsonb)
where key = 'merch';

update public.events_event
set title = 'Singing Contest',
    description = 'TSA\'s annual performance event for student singers, featuring prepared performances, audience energy, and a supportive stage for campus talent.',
    location = 'TBA',
    starts_at = '2027-02-01T12:00:00-06:00',
    ends_at = null,
    time_tba = true,
    time_note = 'Time to be announced',
    updated_at = now()
where source_key = 'original-8' and created_by is null;

update public.events_event
set description = 'Join us at AACC for an evening of mahjong and poker. Food will be available for purchase at AACC.',
    location = 'AACC',
    starts_at = '2026-11-13T23:30:00.000Z',
    ends_at = '2026-11-14T03:00:00.000Z',
    updated_at = now()
where source_key = 'original-10' and created_by is null;

update public.events_event
set starts_at = '2027-03-01T19:30:00.000Z',
    ends_at = '2027-03-01T22:00:00.000Z',
    updated_at = now()
where source_key = 'original-15' and created_by is null;

update public.events_event
set is_published = false,
    updated_at = now()
where source_key in ('original-9', 'original-16') and created_by is null;

insert into public.events_event (
  title, description, location, starts_at, ends_at, image_url, image_gallery,
  link_url, time_zone, time_tba, time_note, show_in_archive, source_key, is_published
)
values (
  'Water Balloon Battle',
  'Join TSA for a water balloon battle this April. More event details will be announced soon.',
  'TBA', '2027-04-01T05:00:00.000Z', null, '', '[]'::jsonb,
  '', 'America/Chicago', true, 'Time to be announced', true,
  'main-water-balloon-battle', true
)
on conflict (source_key) do nothing;
