-- For projects that ALREADY ran the original admin_setup.sql (0100, 0200, 0300).
-- Run once in the hosted SQL Editor. Fresh installations use admin_setup.sql.
begin;

-- Preserve main's current public content while retaining anything an admin edited.
-- Safe for projects that already installed the first website-management setup.
create function pg_temp.tsa_merge_content(current_body jsonb, old_default jsonb, new_default jsonb)
returns jsonb language plpgsql as $$
declare entry record; result jsonb := current_body;
begin
  if current_body = old_default then return new_default; end if;
  if jsonb_typeof(current_body) = 'object' and jsonb_typeof(new_default) = 'object' then
    for entry in select * from jsonb_each(new_default) loop
      if not current_body ? entry.key then
        result := jsonb_set(result, array[entry.key], entry.value);
      else
        result := jsonb_set(result, array[entry.key], pg_temp.tsa_merge_content(current_body->entry.key, old_default->entry.key, entry.value));
      end if;
    end loop;
  end if;
  return result;
end;
$$;

-- Partner confirmation, logos, addresses and extra benefits are now editable.
update public.content_definition set definition = '{"label":"Membership","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"description":{"label":"Description","type":"string","required":false,"multiline":true},"partners":{"label":"Partners","type":"array","item":{"label":"Item","type":"object","fields":{"category":{"label":"Category","type":"string","required":false,"multiline":false},"name":{"label":"Name","type":"string","required":true,"multiline":false},"offer":{"label":"Offer","type":"string","required":false,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"additionalOffer":{"label":"Additional Offer","type":"string","required":false,"multiline":false},"address":{"label":"Address","type":"string","required":false,"multiline":false},"confirmed":{"label":"Confirmed","type":"boolean"},"logo":{"label":"Logo","type":"string","format":"image","required":false,"multiline":false}}}},"features":{"label":"Features","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"pricingPlans":{"label":"Pricing Plans","type":"array","item":{"label":"Item","type":"object","fields":{"name":{"label":"Name","type":"string","required":true,"multiline":false},"price":{"label":"Price","type":"string","required":false,"multiline":false},"note":{"label":"Note","type":"string","required":false,"multiline":true},"body":{"label":"Body","type":"string","required":false,"multiline":true},"featured":{"label":"Featured","type":"boolean"}}}}}}'::jsonb where key = 'membership';

update public.content_document set body = pg_temp.tsa_merge_content(body, '{"name":"UIUC TSA","tagline":"Taiwanese Student Association","footerDescription":"A student-run community at the University of Illinois Urbana-Champaign.","contactEmail":"tsauiuc@gmail.com","socialLinks":[{"label":"Instagram","href":"https://www.instagram.com/uiuctsa/","icon":"instagram"},{"label":"Facebook","href":"https://www.facebook.com/UIUCTSA/","icon":"facebook"},{"label":"Taiwanese at UIUC","href":"https://www.facebook.com/groups/taiwaneseatuiuc/","icon":"arrow-down-to-people"},{"label":"Linktree","href":"https://linktr.ee/uiuctsa","icon":""}]}'::jsonb, '{"name":"TSA UIUC","tagline":"Taiwanese Student Association","footerDescription":"A student-run community at the University of Illinois Urbana-Champaign.","contactEmail":"tsauiuc@gmail.com","socialLinks":[{"label":"Instagram","href":"https://www.instagram.com/uiuctsa/","icon":"instagram"},{"label":"Facebook","href":"https://www.facebook.com/UIUCTSA/","icon":"facebook"},{"label":"Taiwanese at UIUC","href":"https://www.facebook.com/groups/taiwaneseatuiuc/","icon":"arrow-down-to-people"},{"label":"Linktree","href":"https://linktr.ee/uiuctsa","icon":""}]}'::jsonb) where key = 'site';

update public.content_document set body = pg_temp.tsa_merge_content(body, '{"title":"University of Illinois Urbana-Champaign","subtitle":"Taiwanese Student Association","introduction":"這個網站彙集了有關香檳的生活建議，學術分享，甚至文化以及其他討論。UIUC TSA希望能讓此站在復古地以類似部落格形式的同時，能讓大家能溫馨地、有效地找到自己需要的資訊。如果內容有什麼疏漏，歡迎聯繫我們。有想要分享的文章、照片、或者其他創作，我們也非常歡迎投稿！","lifeSections":[{"title":"行前準備","href":"/incoming-students#documents","body":"簽證 / 護照 | 機場到香檳 | 短期住宿","summary":"Start with the essentials before you fly: documents, airport planning, and where to stay when you first arrive.","image":"/content/prep.webp"},{"title":"出境 / 入境","href":"/incoming-students#flight-customs","body":"出境 | 入境 | 海關","summary":"Know what to carry, what to declare, and how to move through immigration with confidence.","image":"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"},{"title":"新生專區","href":"/incoming-students#campus-checkin","body":"學校報到 | 宿舍 | 選課","summary":"Get oriented with ISSS check-in, I-Card, health requirements, NetID, housing, and school systems.","image":"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80"},{"title":"香檳生活","href":"/current-students","body":"電信申辦 | 銀行開戶 | 住宿 | 交通 | 醫療 | 餐廳","summary":"Settle into daily life with student tools for housing, rides, marketplace listings, and community resources.","image":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"}],"interns":[{"month":"September","name":"Steve","role":"Program Department","note":"","photo":"/content/steve.webp"},{"month":"October","name":"Steve","role":"Marketing Department","note":"","photo":"/content/steve.webp"},{"month":"November","name":"Steve","role":"Technology Department","note":"","photo":"/content/steve.webp"},{"month":"December","name":"Steve","role":"Treasury Department","note":"","photo":"/content/steve.webp"},{"month":"January","name":"Steve","role":"Publicity Department","note":"","photo":"/content/steve.webp"},{"month":"February","name":"Steve","role":"Secretary Department","note":"","photo":"/content/steve.webp"}],"joiningTitle":"Join the team behind the events.","joiningDescription":"TSA welcomes students interested in event planning, culture, marketing, design, technology, photography, translation, and community service. Interns help turn ideas into real campus experiences."}'::jsonb, '{"title":"University of Illinois Urbana-Champaign","subtitle":"Taiwanese Student Association","introduction":"這個網站彙集了有關香檳的生活建議，學術分享，甚至文化以及其他討論。UIUC TSA希望能讓此站在復古地以類似部落格形式的同時，能讓大家能溫馨地、有效地找到自己需要的資訊。如果內容有什麼疏漏，歡迎聯繫我們。有想要分享的文章、照片、或者其他創作，我們也非常歡迎投稿！","lifeSections":[{"title":"行前準備","href":"/incoming-students#documents","body":"簽證 / 護照 | 機場到香檳 | 短期住宿","summary":"Start with the essentials before you fly: documents, airport planning, and where to stay when you first arrive.","image":"/content/prep.png"},{"title":"出境 / 入境","href":"/incoming-students#flight-customs","body":"出境 | 入境 | 海關","summary":"Know what to carry, what to declare, and how to move through immigration with confidence.","image":"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"},{"title":"新生專區","href":"/incoming-students#campus-checkin","body":"學校報到 | 宿舍 | 選課","summary":"Get oriented with ISSS check-in, I-Card, health requirements, NetID, housing, and school systems.","image":"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80"},{"title":"香檳生活","href":"/current-students","body":"電信申辦 | 銀行開戶 | 住宿 | 交通 | 醫療 | 餐廳","summary":"Settle into daily life with student tools for housing, rides, marketplace listings, and community resources.","image":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"}],"interns":[{"month":"September 2026","name":"Barron Tsai","role":"Marketing","note":"","photo":"/content/barron-marketing.jpg"},{"month":"September 2026","name":"Ryan Hsu","role":"Program","note":"","photo":""}],"joiningTitle":"Join the team behind the events.","joiningDescription":"TSA welcomes students interested in event planning, culture, marketing, design, technology, photography, translation, and community service. Interns help turn ideas into real campus experiences."}'::jsonb) where key = 'home';

update public.content_document set body = pg_temp.tsa_merge_content(body, '{"title":"About TSA","introductionEnglish":"Taiwanese Student Association (TSA) is a non-profit student organization at University of Illinois at Urbana-Champaign (UIUC) dedicated to serve Taiwanese community in Champaign-Urbana region. Needless to say, we are also a culture-oriented RSO (registered student organization), so we will also promote cultural awareness about Taiwan via events and cultural creations. TSA envisions itself as a friendly and practical media for Taiwaneses to recognize and/or help each other.","introductionChinese":"伊利諾大學香檳分校的台灣同學會(TSA)，一直致力於服務UIUC的台灣人社群，並積極宣揚台灣的豐富文化。我們的理想是創造一個互助並交流的平台，讓在香檳的台灣人有家的感覺。TSA以實際行動來援助台灣人社群的需要，並以推廣台灣的文化價值。自從2002年成立以來，我們堅持使命和初衷，為我們的台灣人社群服務，並讓其他群體更加了解台灣。","board":[{"name":"Tim Chen","role":"President","photo":"/content/tim.webp"},{"name":"Eric Chang","role":"Vice President","photo":"/content/eric.webp"},{"name":"Chloe Lee","role":"Vice President","photo":"/content/chloe.webp"},{"name":"Derrick Lin","role":"Treasury Director","photo":"/content/derrick.webp"},{"name":"Brandon Tsai","role":"Program Director","photo":"/content/brandon.webp"},{"name":"Ulanda Chen","role":"Marketing Director","photo":"/content/ulanda.webp"},{"name":"Sean Hsiung","role":"Publicity Director","photo":"/content/sean.webp"},{"name":"Sylvia Hou","role":"Secretary Director","photo":"/content/sylvia.webp"},{"name":"Burton Wang","role":"Technology Director","photo":""}],"sponsors":[{"name":"TSMC (台灣積體電路製造)","logo":"/content/tsmc-logo.webp"},{"name":"Steve","logo":"/content/steve.webp"},{"name":"招募中","logo":""},{"name":"招募中","logo":""}],"contributors":[{"title":"Who made this page?","body":"This website was developed in 2026 by Eric Chang & Burton Wang. Ongoing maintenance is managed by the TSA Technology Department."},{"title":"Join as contributor:","body":"We manage contributions through GitHub. If you would like to contribute, please open a pull request by following the instructions provided in the repository’s README and direct message UIUC TSA via Instagram, Facebook, or email."}]}'::jsonb, '{"title":"About TSA","introductionEnglish":"Taiwanese Student Association (TSA) is a non-profit student organization at University of Illinois at Urbana-Champaign (UIUC) dedicated to serve Taiwanese community in Champaign-Urbana region. Needless to say, we are also a culture-oriented RSO (registered student organization), so we will also promote cultural awareness about Taiwan via events and cultural creations. TSA envisions itself as a friendly and practical media for Taiwaneses to recognize and/or help each other.","introductionChinese":"伊利諾大學香檳分校的台灣同學會(TSA)，一直致力於服務UIUC的台灣人社群，並積極宣揚台灣的豐富文化。我們的理想是創造一個互助並交流的平台，讓在香檳的台灣人有家的感覺。TSA以實際行動來援助台灣人社群的需要，並以推廣台灣的文化價值。自從2002年成立以來，我們堅持使命和初衷，為我們的台灣人社群服務，並讓其他群體更加了解台灣。","board":[{"name":"Tim Chen","role":"President","photo":"/content/tim.jpg"},{"name":"Eric Chang","role":"Vice President","photo":"/content/eric.jpg"},{"name":"Chloe Lee","role":"Vice President","photo":"/content/chloe.jpg"},{"name":"Derrick Lin","role":"Treasury Director","photo":"/content/derrick.jpg"},{"name":"Brandon Tsai","role":"Program Director","photo":"/content/brandon.jpg"},{"name":"Ulanda Chen","role":"Marketing Director","photo":"/content/ulanda.jpg"},{"name":"Sean Hsiung","role":"Publicity Director","photo":"/content/sean.jpg"},{"name":"Sylvia Hou","role":"Secretary Director","photo":"/content/sylvia.jpg"},{"name":"Burton Wang","role":"Technology Director","photo":"/content/burton.jpeg"}],"sponsors":[{"name":"TSMC (台灣積體電路製造)","logo":"/content/tsmc-logo.png"},{"name":"LaTea","logo":"/content/latea-logo.png"},{"name":"Weee","logo":"/content/weee-logo.png"},{"name":"TECO Taiwan","logo":""}],"contributors":[{"title":"Who made this page?","body":"This website was developed in 2026 by Eric Chang & Burton Wang. Ongoing maintenance is managed by the TSA Technology Department."},{"title":"Join as contributor:","body":"We manage contributions through GitHub. If you would like to contribute, please open a pull request by following the instructions provided in the repository’s README and direct message TSA UIUC via Instagram, Facebook, or email."}]}'::jsonb) where key = 'about';

update public.content_document set body = (select jsonb_set(document, '{partners}', coalesce((select jsonb_agg(jsonb_build_object('address', '', 'additionalOffer', '', 'confirmed', true, 'logo', '') || partner order by ordinal) from jsonb_array_elements(document->'partners') with ordinality as p(partner, ordinal)), '[]'::jsonb)) from (select pg_temp.tsa_merge_content(body, '{"title":"UIUC TSA Membership","description":"Join TSA to support Taiwanese community programming at UIUC and get access to lifetime member benefits, partner discounts, merch announcements, and the official Line Announcement System.","partners":[{"category":"Restaurant","name":"Golden Harbor 漁滿樓","offer":"5% off of all purchases","href":"https://goo.gl/maps/"},{"category":"Restaurant","name":"PHO Noodle Station","offer":"10% off on purchases above $15, except lunch special","href":"https://goo.gl/maps/"},{"category":"Restaurant","name":"Paris Super","offer":"10% off all purchases above $15 pre-tax","href":"https://goo.gl/maps/"},{"category":"Beverages","name":"HAPPYLEMON","offer":"10% off on all purchases","href":"https://www.google.com/maps"},{"category":"Groceries","name":"Weee","offer":"To be announced","href":"https://www.sayweee.com/"}],"features":["Lifetime TSA membership","Non-transferable membership holder benefits","Partner store discounts","Membership card and Line Announcement System enrollment"],"pricingPlans":[{"name":"Bundle","price":"$47.99","note":"Best value","body":"TSA membership plus T-shirt Merch Bundle","featured":true},{"name":"TSA Membership","price":"$29.99","note":"Lifetime, non-transferable","body":"Lifetime access to TSA membership benefits, partner discounts, card verification, and announcements for the registered member.","featured":false}]}'::jsonb, '{"title":"TSA UIUC Membership","description":"Join TSA to support Taiwanese community programming at UIUC and get access to lifetime member benefits, membership-card updates, merch announcements, and the official Line Announcement System.","partners":[{"category":"Beverages","name":"LaTea","offer":"10% off in-store at LaTea (regular-priced drinks only). Cannot be combined with other discounts or promotions.","href":"","additionalOffer":"Early access to seasonal drinks and new product launches.","address":"601 S 6th St Apt 105, Champaign, IL 61820","confirmed":true,"logo":"/content/latea-logo.png"},{"category":"Restaurant","name":"Golden Harbor 漁滿樓","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":""},{"category":"Restaurant","name":"PHO Noodle Station","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":""},{"category":"Restaurant","name":"Paris Super","offer":"To be announced","href":"https://goo.gl/maps/","additionalOffer":"","address":"","confirmed":false,"logo":""},{"category":"Beverages","name":"HAPPYLEMON","offer":"To be announced","href":"https://www.google.com/maps","additionalOffer":"","address":"","confirmed":false,"logo":""},{"category":"Groceries","name":"Weee","offer":"To be announced","href":"https://www.sayweee.com/","additionalOffer":"","address":"","confirmed":false,"logo":""}],"features":["Lifetime TSA membership","Non-transferable membership holder benefits","LaTea partner discounts and early access to new drinks","Membership card and Line Announcement System enrollment","Membership card discounts cannot be combined with other event discounts"],"pricingPlans":[{"name":"Bundle","price":"$49.99","note":"Best value","body":"TSA membership plus one T-shirt Merch Bundle. Bundle price applies to one T-shirt only.","featured":true},{"name":"TSA Membership","price":"$29.99","note":"Lifetime, non-transferable","body":"Lifetime access to TSA membership benefits, membership card verification, and announcements for the registered member, including LaTea partner benefits.","featured":false}]}'::jsonb) as document) merged) where key = 'membership';

update public.content_document set body = pg_temp.tsa_merge_content(body, '{"title":"TSA 呆丸囡仔 T-shirt","purchaseUrl":"https://myship.7-11.com.tw/general/detail/GM2607092499849","bundlePrice":"$47.99","membershipPrice":"$29.99","shirtPrice":"$32.99","releaseDate":"Released July 10, 2026","banner":"/content/tsa-merch-banner.webp","design":"/content/raw-merch.webp","posters":[{"src":"/content/tsa-merch-poster-1.webp","label":"Poster Preview 1"},{"src":"/content/tsa-merch-poster-2.webp","label":"Poster Preview 2"}],"paragraphs":["新學期 TSA 官方周邊正式上線啦！","這次帶來的是「呆丸囡仔」落肩短 T，把遠在香檳校園的回憶、熱血與歸屬感，穿進日常生活。不論你是即將啟程的新生、努力奮鬥的在校生，還是想念 Alma Mater 的校友，都能用這件 TSA 專屬設計展現屬於我們的 Illini Pride！","最百搭、最耐看的經典黑白雙色系列，簡約有質感，無論是在圖書館讀書、出門吃早午餐，還是日常穿搭都能輕鬆駕馭。穿上它，不管身在香檳還是台灣，都能一眼認出自己的 TSA 家人！","趕快入手，一起把屬於 UIUC 的回憶穿在身上吧！"],"englishParagraphs":["UIUC TSA’s official merchandise for the new semester is finally here!","This time, we are introducing the 「呆丸囡仔」oversized T-shirt, designed to bring the memories, energy, and sense of belonging from campus in Champaign into your everyday life. Whether you are an incoming student about to begin a new journey, a current student working hard on campus, or an alum who misses your alma mater, this TSA-exclusive design is the perfect way to show your Illini Pride! 🧡 💙","Available in classic black and white, these timeless and versatile colors make the shirt easy to style for any occasion. Whether you are studying at the library, heading out for brunch, or putting together a casual everyday outfit, it fits effortlessly into your wardrobe. No matter whether you are in Champaign or Taiwan, wearing it will help you instantly recognize fellow members of the TSA community!","Get yours now and carry your UIUC memories with you wherever you go!"]}'::jsonb, '{"title":"TSA 呆丸囡仔 T-shirt","purchaseUrl":"https://myship.7-11.com.tw/general/detail/GM2607092499849","bundlePrice":"$49.99","membershipPrice":"$29.99","shirtPrice":"$32.99","releaseDate":"Released July 10, 2026","banner":"/content/tsa-merch-banner.webp","design":"/content/raw-merch.png","posters":[{"src":"/content/tsa-merch-poster-1.jpeg","label":"Poster Preview 1"},{"src":"/content/tsa-merch-poster-2.jpeg","label":"Poster Preview 2"}],"paragraphs":["新學期 TSA 官方周邊正式上線啦！","這次帶來的是 「呆丸囡仔」落肩短 T，把遠在香檳校園的回憶、熱血與歸屬感，穿進日常生活。不論你是即將啟程的新生、努力奮鬥的在校生，還是想念 Alma Mater 的校友，都能用這件 TSA 專屬設計展現屬於我們的 Illini Pride！🧡 💙","最百搭、最耐看的 經典黑白雙色系列，簡約有質感，無論是在圖書館讀書、出門吃早午餐，還是日常穿搭都能輕鬆駕馭。穿上它，不管身在香檳還是台灣，都能一眼認出自己的 TSA 家人！","趕快入手，一起把屬於 UIUC 的回憶穿在身上吧！"],"englishParagraphs":["TSA UIUC’s official merchandise for the new semester is finally here!","This time, we are introducing the 「呆丸囡仔」oversized T-shirt, designed to bring the memories, energy, and sense of belonging from campus in Champaign into your everyday life. Whether you are an incoming student about to begin a new journey, a current student working hard on campus, or an alum who misses your alma mater, this TSA-exclusive design is the perfect way to show your Illini Pride! 🧡 💙","Available in classic black and white, these timeless and versatile colors make the shirt easy to style for any occasion. Whether you are studying at the library, heading out for brunch, or putting together a casual everyday outfit, it fits effortlessly into your wardrobe. No matter whether you are in Champaign or Taiwan, wearing it will help you instantly recognize fellow members of the TSA community!","Get yours now and carry your UIUC memories with you wherever you go!"]}'::jsonb) where key = 'merch';


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


commit;
