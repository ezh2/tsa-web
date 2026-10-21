-- Run ONCE in the hosted Supabase SQL Editor after the admin-role rename.
-- Contains the five website-management migrations below, in dependency order.
-- This alternative to the CLI does not record Supabase CLI migration history.
-- The transaction keeps setup all-or-nothing; it does not reset existing data.
begin;

do $$ begin
  if not exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'role' and e.enumlabel = 'admin') then
    raise exception 'Apply the admin-role rename before installing website management.';
  end if;
end $$;

-- Migration: 20261021010000_init_website_content.sql
-- Public website documents. Only admins can publish; all clients can read.
-- Definitions also validate writes made directly through the Supabase API.
create table public.content_definition (
  key text primary key,
  definition jsonb not null
);
alter table public.content_definition enable row level security;
create policy content_definition_read on public.content_definition for select to anon, authenticated using (true);

create function public.content_validate_value(value jsonb, spec jsonb)
returns boolean language plpgsql immutable set search_path = public as $$
declare field record; item jsonb; text_value text; valid_url boolean;
begin
  if value is null or jsonb_typeof(value) <> spec->>'type' then return false; end if;
  case spec->>'type'
  when 'string' then
    text_value := value #>> '{}';
    if length(text_value) > 20000 then return false; end if;
    if coalesce((spec->>'required')::boolean, false) and length(btrim(text_value)) = 0 then return false; end if;
    if spec->>'format' in ('url', 'image') and text_value <> '' then
      if text_value ~ '[[:space:][:cntrl:]]' or position(chr(92) in text_value) > 0 then return false; end if;
      valid_url := text_value ~* '^https?://[^/@?#[:space:]]+([/?#].*)?$'
        or (left(text_value, 1) = '/' and left(text_value, 2) <> '//');
      if spec->>'format' = 'url' then
        valid_url := valid_url or text_value ~ '^#[A-Za-z0-9_-]+$' or text_value ~ '^mailto:[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$';
      end if;
      if not valid_url then return false; end if;
    end if;
    if spec->>'format' = 'email' and text_value !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then return false; end if;
  when 'boolean' then return true;
  when 'array' then
    if jsonb_array_length(value) > 100 then return false; end if;
    for item in select * from jsonb_array_elements(value) loop
      if not public.content_validate_value(item, spec->'item') then return false; end if;
    end loop;
  when 'object' then
    if (select count(*) from jsonb_object_keys(value)) <> (select count(*) from jsonb_object_keys(spec->'fields')) then return false; end if;
    for field in select * from jsonb_each(spec->'fields') loop
      if not public.content_validate_value(value->field.key, field.value) then return false; end if;
    end loop;
  else return false;
  end case;
  return true;
end;
$$;

create function public.content_validate_document(document_key text, body jsonb)
returns boolean language sql stable set search_path = public as $$
  select coalesce((select public.content_validate_value(body, definition) from public.content_definition where key = document_key), false)
$$;

create table public.content_document (
  key text primary key references public.content_definition(key),
  body jsonb not null,
  revision integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null,
  check (octet_length(body::text) <= 1000000),
  check (public.content_validate_document(key, body))
);
alter table public.content_document enable row level security;
create policy content_document_read on public.content_document for select to anon, authenticated using (true);
create policy content_document_update_admin on public.content_document for update to authenticated
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
grant select on public.content_definition, public.content_document to anon, authenticated;
grant update on public.content_document to authenticated;

create function public.tg_content_document_update()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.key <> old.key then raise exception 'Content keys cannot be changed'; end if;
  new.revision := old.revision + 1;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
create trigger content_document_update before update on public.content_document
  for each row execute function public.tg_content_document_update();

-- Admin uploads are immutable objects. Public visitors can view their images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;
create policy site_media_read on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
create policy site_media_insert_admin on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.current_user_role() = 'admin');
create policy site_media_delete_admin on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.current_user_role() = 'admin');

-- Preserve the current site as the initial editable content.
insert into public.content_definition (key, definition) values ('site', '{"label":"Site","type":"object","fields":{"name":{"label":"Name","type":"string","required":true,"multiline":false},"tagline":{"label":"Tagline","type":"string","required":false,"multiline":false},"footerDescription":{"label":"Footer Description","type":"string","required":false,"multiline":true},"contactEmail":{"label":"Contact Email","type":"string","format":"email","required":false,"multiline":false},"socialLinks":{"label":"Social Links","type":"array","item":{"label":"Item","type":"object","fields":{"label":{"label":"Label","type":"string","required":true,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":true,"multiline":false},"icon":{"label":"Icon","type":"string","required":false,"multiline":false}}}}}}'::jsonb);
insert into public.content_document (key, body) values ('site', '{"name":"UIUC TSA","tagline":"Taiwanese Student Association","footerDescription":"A student-run community at the University of Illinois Urbana-Champaign.","contactEmail":"tsauiuc@gmail.com","socialLinks":[{"label":"Instagram","href":"https://www.instagram.com/uiuctsa/","icon":"instagram"},{"label":"Facebook","href":"https://www.facebook.com/UIUCTSA/","icon":"facebook"},{"label":"Taiwanese at UIUC","href":"https://www.facebook.com/groups/taiwaneseatuiuc/","icon":"arrow-down-to-people"},{"label":"Linktree","href":"https://linktr.ee/uiuctsa","icon":""}]}'::jsonb);

insert into public.content_definition (key, definition) values ('home', '{"label":"Home","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"subtitle":{"label":"Subtitle","type":"string","required":true,"multiline":false},"introduction":{"label":"Introduction","type":"string","required":false,"multiline":true},"lifeSections":{"label":"Life Sections","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":true,"multiline":false},"body":{"label":"Body","type":"string","required":false,"multiline":true},"summary":{"label":"Summary","type":"string","required":false,"multiline":true},"image":{"label":"Image","type":"string","format":"image","required":false,"multiline":false}}}},"interns":{"label":"Interns","type":"array","item":{"label":"Item","type":"object","fields":{"month":{"label":"Month","type":"string","required":false,"multiline":false},"name":{"label":"Name","type":"string","required":true,"multiline":false},"role":{"label":"Role","type":"string","required":false,"multiline":false},"note":{"label":"Note","type":"string","required":false,"multiline":true},"photo":{"label":"Photo","type":"string","format":"image","required":false,"multiline":false}}}},"joiningTitle":{"label":"Joining Title","type":"string","required":false,"multiline":false},"joiningDescription":{"label":"Joining Description","type":"string","required":false,"multiline":true}}}'::jsonb);
insert into public.content_document (key, body) values ('home', '{"title":"University of Illinois Urbana-Champaign","subtitle":"Taiwanese Student Association","introduction":"這個網站彙集了有關香檳的生活建議，學術分享，甚至文化以及其他討論。UIUC TSA希望能讓此站在復古地以類似部落格形式的同時，能讓大家能溫馨地、有效地找到自己需要的資訊。如果內容有什麼疏漏，歡迎聯繫我們。有想要分享的文章、照片、或者其他創作，我們也非常歡迎投稿！","lifeSections":[{"title":"行前準備","href":"/incoming-students#documents","body":"簽證 / 護照 | 機場到香檳 | 短期住宿","summary":"Start with the essentials before you fly: documents, airport planning, and where to stay when you first arrive.","image":"/content/prep.webp"},{"title":"出境 / 入境","href":"/incoming-students#flight-customs","body":"出境 | 入境 | 海關","summary":"Know what to carry, what to declare, and how to move through immigration with confidence.","image":"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"},{"title":"新生專區","href":"/incoming-students#campus-checkin","body":"學校報到 | 宿舍 | 選課","summary":"Get oriented with ISSS check-in, I-Card, health requirements, NetID, housing, and school systems.","image":"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80"},{"title":"香檳生活","href":"/current-students","body":"電信申辦 | 銀行開戶 | 住宿 | 交通 | 醫療 | 餐廳","summary":"Settle into daily life with student tools for housing, rides, marketplace listings, and community resources.","image":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"}],"interns":[{"month":"September","name":"Steve","role":"Program Department","note":"","photo":"/content/steve.webp"},{"month":"October","name":"Steve","role":"Marketing Department","note":"","photo":"/content/steve.webp"},{"month":"November","name":"Steve","role":"Technology Department","note":"","photo":"/content/steve.webp"},{"month":"December","name":"Steve","role":"Treasury Department","note":"","photo":"/content/steve.webp"},{"month":"January","name":"Steve","role":"Publicity Department","note":"","photo":"/content/steve.webp"},{"month":"February","name":"Steve","role":"Secretary Department","note":"","photo":"/content/steve.webp"}],"joiningTitle":"Join the team behind the events.","joiningDescription":"TSA welcomes students interested in event planning, culture, marketing, design, technology, photography, translation, and community service. Interns help turn ideas into real campus experiences."}'::jsonb);

insert into public.content_definition (key, definition) values ('about', '{"label":"About","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"introductionEnglish":{"label":"Introduction English","type":"string","required":false,"multiline":true},"introductionChinese":{"label":"Introduction Chinese","type":"string","required":false,"multiline":true},"board":{"label":"Board","type":"array","item":{"label":"Item","type":"object","fields":{"name":{"label":"Name","type":"string","required":true,"multiline":false},"role":{"label":"Role","type":"string","required":false,"multiline":false},"photo":{"label":"Photo","type":"string","format":"image","required":false,"multiline":false}}}},"sponsors":{"label":"Sponsors","type":"array","item":{"label":"Item","type":"object","fields":{"name":{"label":"Name","type":"string","required":true,"multiline":false},"logo":{"label":"Logo","type":"string","format":"image","required":false,"multiline":false}}}},"contributors":{"label":"Contributors","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"body":{"label":"Body","type":"string","required":false,"multiline":true}}}}}}'::jsonb);
insert into public.content_document (key, body) values ('about', '{"title":"About TSA","introductionEnglish":"Taiwanese Student Association (TSA) is a non-profit student organization at University of Illinois at Urbana-Champaign (UIUC) dedicated to serve Taiwanese community in Champaign-Urbana region. Needless to say, we are also a culture-oriented RSO (registered student organization), so we will also promote cultural awareness about Taiwan via events and cultural creations. TSA envisions itself as a friendly and practical media for Taiwaneses to recognize and/or help each other.","introductionChinese":"伊利諾大學香檳分校的台灣同學會(TSA)，一直致力於服務UIUC的台灣人社群，並積極宣揚台灣的豐富文化。我們的理想是創造一個互助並交流的平台，讓在香檳的台灣人有家的感覺。TSA以實際行動來援助台灣人社群的需要，並以推廣台灣的文化價值。自從2002年成立以來，我們堅持使命和初衷，為我們的台灣人社群服務，並讓其他群體更加了解台灣。","board":[{"name":"Tim Chen","role":"President","photo":"/content/tim.webp"},{"name":"Eric Chang","role":"Vice President","photo":"/content/eric.webp"},{"name":"Chloe Lee","role":"Vice President","photo":"/content/chloe.webp"},{"name":"Derrick Lin","role":"Treasury Director","photo":"/content/derrick.webp"},{"name":"Brandon Tsai","role":"Program Director","photo":"/content/brandon.webp"},{"name":"Ulanda Chen","role":"Marketing Director","photo":"/content/ulanda.webp"},{"name":"Sean Hsiung","role":"Publicity Director","photo":"/content/sean.webp"},{"name":"Sylvia Hou","role":"Secretary Director","photo":"/content/sylvia.webp"},{"name":"Burton Wang","role":"Technology Director","photo":""}],"sponsors":[{"name":"TSMC (台灣積體電路製造)","logo":"/content/tsmc-logo.webp"},{"name":"Steve","logo":"/content/steve.webp"},{"name":"招募中","logo":""},{"name":"招募中","logo":""}],"contributors":[{"title":"Who made this page?","body":"This website was developed in 2026 by Eric Chang & Burton Wang. Ongoing maintenance is managed by the TSA Technology Department."},{"title":"Join as contributor:","body":"We manage contributions through GitHub. If you would like to contribute, please open a pull request by following the instructions provided in the repository’s README and direct message UIUC TSA via Instagram, Facebook, or email."}]}'::jsonb);

insert into public.content_definition (key, definition) values ('membership', '{"label":"Membership","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"description":{"label":"Description","type":"string","required":false,"multiline":true},"partners":{"label":"Partners","type":"array","item":{"label":"Item","type":"object","fields":{"category":{"label":"Category","type":"string","required":false,"multiline":false},"name":{"label":"Name","type":"string","required":true,"multiline":false},"offer":{"label":"Offer","type":"string","required":false,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false}}}},"features":{"label":"Features","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"pricingPlans":{"label":"Pricing Plans","type":"array","item":{"label":"Item","type":"object","fields":{"name":{"label":"Name","type":"string","required":true,"multiline":false},"price":{"label":"Price","type":"string","required":false,"multiline":false},"note":{"label":"Note","type":"string","required":false,"multiline":true},"body":{"label":"Body","type":"string","required":false,"multiline":true},"featured":{"label":"Featured","type":"boolean"}}}}}}'::jsonb);
insert into public.content_document (key, body) values ('membership', '{"title":"UIUC TSA Membership","description":"Join TSA to support Taiwanese community programming at UIUC and get access to lifetime member benefits, partner discounts, merch announcements, and the official Line Announcement System.","partners":[{"category":"Restaurant","name":"Golden Harbor 漁滿樓","offer":"5% off of all purchases","href":"https://goo.gl/maps/"},{"category":"Restaurant","name":"PHO Noodle Station","offer":"10% off on purchases above $15, except lunch special","href":"https://goo.gl/maps/"},{"category":"Restaurant","name":"Paris Super","offer":"10% off all purchases above $15 pre-tax","href":"https://goo.gl/maps/"},{"category":"Beverages","name":"HAPPYLEMON","offer":"10% off on all purchases","href":"https://www.google.com/maps"},{"category":"Groceries","name":"Weee","offer":"To be announced","href":"https://www.sayweee.com/"}],"features":["Lifetime TSA membership","Non-transferable membership holder benefits","Partner store discounts","Membership card and Line Announcement System enrollment"],"pricingPlans":[{"name":"Bundle","price":"$47.99","note":"Best value","body":"TSA membership plus T-shirt Merch Bundle","featured":true},{"name":"TSA Membership","price":"$29.99","note":"Lifetime, non-transferable","body":"Lifetime access to TSA membership benefits, partner discounts, card verification, and announcements for the registered member.","featured":false}]}'::jsonb);

insert into public.content_definition (key, definition) values ('merch', '{"label":"Merch","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"purchaseUrl":{"label":"Purchase Url","type":"string","format":"url","required":false,"multiline":false},"bundlePrice":{"label":"Bundle Price","type":"string","required":false,"multiline":false},"membershipPrice":{"label":"Membership Price","type":"string","required":false,"multiline":false},"shirtPrice":{"label":"Shirt Price","type":"string","required":false,"multiline":false},"releaseDate":{"label":"Release Date","type":"string","required":false,"multiline":false},"banner":{"label":"Banner","type":"string","format":"image","required":false,"multiline":false},"design":{"label":"Design","type":"string","format":"image","required":false,"multiline":false},"posters":{"label":"Posters","type":"array","item":{"label":"Item","type":"object","fields":{"src":{"label":"Src","type":"string","format":"image","required":false,"multiline":false},"label":{"label":"Label","type":"string","required":true,"multiline":false}}}},"paragraphs":{"label":"Paragraphs","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"englishParagraphs":{"label":"English Paragraphs","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}}}}'::jsonb);
insert into public.content_document (key, body) values ('merch', '{"title":"TSA 呆丸囡仔 T-shirt","purchaseUrl":"https://myship.7-11.com.tw/general/detail/GM2607092499849","bundlePrice":"$47.99","membershipPrice":"$29.99","shirtPrice":"$32.99","releaseDate":"Released July 10, 2026","banner":"/content/tsa-merch-banner.webp","design":"/content/raw-merch.webp","posters":[{"src":"/content/tsa-merch-poster-1.webp","label":"Poster Preview 1"},{"src":"/content/tsa-merch-poster-2.webp","label":"Poster Preview 2"}],"paragraphs":["新學期 TSA 官方周邊正式上線啦！","這次帶來的是「呆丸囡仔」落肩短 T，把遠在香檳校園的回憶、熱血與歸屬感，穿進日常生活。不論你是即將啟程的新生、努力奮鬥的在校生，還是想念 Alma Mater 的校友，都能用這件 TSA 專屬設計展現屬於我們的 Illini Pride！","最百搭、最耐看的經典黑白雙色系列，簡約有質感，無論是在圖書館讀書、出門吃早午餐，還是日常穿搭都能輕鬆駕馭。穿上它，不管身在香檳還是台灣，都能一眼認出自己的 TSA 家人！","趕快入手，一起把屬於 UIUC 的回憶穿在身上吧！"],"englishParagraphs":["UIUC TSA’s official merchandise for the new semester is finally here!","This time, we are introducing the 「呆丸囡仔」oversized T-shirt, designed to bring the memories, energy, and sense of belonging from campus in Champaign into your everyday life. Whether you are an incoming student about to begin a new journey, a current student working hard on campus, or an alum who misses your alma mater, this TSA-exclusive design is the perfect way to show your Illini Pride! 🧡 💙","Available in classic black and white, these timeless and versatile colors make the shirt easy to style for any occasion. Whether you are studying at the library, heading out for brunch, or putting together a casual everyday outfit, it fits effortlessly into your wardrobe. No matter whether you are in Champaign or Taiwan, wearing it will help you instantly recognize fellow members of the TSA community!","Get yours now and carry your UIUC memories with you wherever you go!"]}'::jsonb);

insert into public.content_definition (key, definition) values ('incoming', '{"label":"Incoming","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"description":{"label":"Description","type":"string","required":false,"multiline":true},"orientationUrl":{"label":"Orientation Url","type":"string","format":"url","required":false,"multiline":false},"orientationImage":{"label":"Orientation Image","type":"string","format":"image","required":false,"multiline":false},"passportItems":{"label":"Passport Items","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"visaDocuments":{"label":"Visa Documents","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"specialDocuments":{"label":"Special Documents","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"orientationDetails":{"label":"Orientation Details","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"departureItems":{"label":"Departure Items","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"customsItems":{"label":"Customs Items","type":"array","item":{"label":"Item","type":"string","required":false,"multiline":false}},"travelOptions":{"label":"Travel Options","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}}}}},"housingOptions":{"label":"Housing Options","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"hrefLabel":{"label":"Href Label","type":"string","required":false,"multiline":false}}}},"campusCheckin":{"label":"Campus Checkin","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"hrefLabel":{"label":"Href Label","type":"string","required":false,"multiline":false}}}},"campusHousing":{"label":"Campus Housing","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"hrefLabel":{"label":"Href Label","type":"string","required":false,"multiline":false}}}},"schoolWebsites":{"label":"School Websites","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}}}}},"parentPaymentSteps":{"label":"Parent Payment Steps","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}}}}},"legalInfo":{"label":"Legal Info","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}},"href":{"label":"Href","type":"string","format":"url","required":false,"multiline":false},"hrefLabel":{"label":"Href Label","type":"string","required":false,"multiline":false}}}},"recommendedSites":{"label":"Recommended Sites","type":"array","item":{"label":"Item","type":"object","fields":{"label":{"label":"Label","type":"string","required":true,"multiline":false},"href":{"label":"Href","type":"string","format":"url","required":true,"multiline":false}}}},"militaryService":{"label":"Military Service","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"details":{"label":"Details","type":"array","item":{"label":"Detail","type":"string","required":false,"multiline":false}}}}}}}'::jsonb);
insert into public.content_document (key, body) values ('incoming', '{"title":"行前準備","description":"給即將前往 UIUC 的新生與家長：這裡整理簽證護照、抵達香檳、短期住宿與兵役相關資訊，幫助你把出發前的準備一次確認好。","orientationUrl":"https://drive.google.com/file/d/1XQUzouvdKBJ9bWFAMBzvMgI-GwMjHEQn/view","orientationImage":"/content/new-stud-oren-2627.webp","passportItems":["簡式護照資料表","證件照兩張（六個月內彩色、光面、白色背景）","舊護照","身分證正本","規費 $1,300 / 本"],"visaDocuments":["I-901 付款收據","AIT 面試預約單","DS-160 確認頁面","I-20 文件","成績單","財力證明","入學證明","TOEFL / IELTS / GRE / GMAT","簽證申請手續費繳費收據（郵政劃撥）"],"specialDocuments":["台灣戶籍謄本（若改過名）","個人簡歷或履歷表（學士以上 / 有技術或科學背景申請人）","放棄證明（若曾有綠卡）"],"orientationDetails":["日期：2026 年 6 月 27 日","時間：10:00 AM - 12:00 PM","開放入場：9:30 AM","地點：集思北科大會議中心 2F 貝塔廳","建議新生與家長一起參加，現場會整理抵達 UIUC 前後最常遇到的問題。"],"departureItems":["護照","I-20 文件","登機證","現金","親友、接機人或住處的地址與電話","起飛前兩小時至機場櫃檯報到","出發前確認航空公司最新旅遊限制與規定"],"customsItems":["入境美國前，機上空服員通常會發放海關申報書；請在下飛機前填妥。","不可攜帶肉類、農作物等受限制物品，申報內容建議如實填寫。","若攜帶超過一萬美金現金，應主動向海關申報並填寫 4790 表單。","通關時請備妥護照、學生簽證、I-20 等文件。","移民官可能詢問就讀學校、美國居住地址、來訪目的、攜帶現金及貴重物品，簡潔誠實回答即可。"],"travelOptions":[{"title":"Shuttle Bus 客運","href":"https://peoriacharter.com/","details":["行李數量：2 件大型行李，一件隨身（超過每一件多加 $10）","票價：Around $37","通勤時間：3 - 4 小時（會繞去其他地點接送）","可於 ORD 機場國際航廈 Terminal 5 或 Terminal 2 的 Bus Shuttle Center 搭乘"]},{"title":"Train 火車","href":"https://www.amtrak.com/","details":["行李數量：2 件大型行李","票價：Around $39","通勤方式：需先搭乘芝加哥地鐵 CTA 至 Chicago 市中心的 Union Station，再轉乘 Amtrak 到香檳"]},{"title":"Automobile 汽車","details":["朋友接送：記得請他吃飯，來回會開 4 - 5 個小時","Uber / Lyft：超過一小時的車程較難，轎車通常可放兩件行李，價格大約 $170 - $250","Uber / Lyft 休旅或廂型車：可放至少四件行李，價格大約 $430 - $500","華人包車：價格大約 $250 - $300（可能臨時漲價），廂型車 / 四人可放置 7 - 8 件行李"],"href":""}],"housingOptions":[{"title":"學校宿舍 Early Arrival","details":["若抵達學校時間比宿舍或租屋合約早，可以考慮申請學校宿舍 early arrival。","通常為按天數計算，一天 $40 - $60。"],"href":"https://housing.illinois.edu/","hrefLabel":"UIUC Housing Website"},{"title":"學生轉租 Sublease","details":["相關資訊可至臉書社團上詢問，或行前與學長姐聯絡。","可留意 Taiwanese at UIUC 等社群資訊。"],"href":"","hrefLabel":""},{"title":"Airbnb","details":["當地屋主或租房的學生會把 sublease 放至 Airbnb 上，比私下聯絡更有保障。"],"href":"","hrefLabel":""},{"title":"飯店 Hotel","details":["Illini Union Hotel","TownePlace Suites by Marriott Champaign Urbana / Campustown","Hampton Inn Champaign / Urbana","Hyatt Place Champaign / Urbana","Hilton Garden Inn Champaign / Urbana","Holiday Inn Express & Suites Urbana-Champaign","Holiday Inn Champaign"],"href":"","hrefLabel":""}],"campusCheckin":[{"title":"ISSS 報到","details":["Complete Online Check-in E-Form。","F-1 與 J-1 學生須準備護照、入境簽證、I-20、I-94。","Complete New International Student Checklist。","Check-in 日期與時間每年可能不同，請以 ISSS 官方資訊為準。"],"href":"https://isss.illinois.edu/","hrefLabel":"International Student Check-In"},{"title":"宿舍 / 系上報到","details":["註冊搬進宿舍時間。","到指定地點領取鑰匙以及新生包；每個系的地點不一樣。","宿舍沒有限制幫忙 move-in 人數，但是幫忙的人不能過夜。"],"href":"","hrefLabel":""},{"title":"領取學生證 I-Card","details":["可以在抵達學校前先上傳照片，或到現場拍照。","辦理時請攜帶護照或相關身分證明文件。","在 Illini Union Bookstore 領取學生證。","建議先領取學生證再到宿舍報到；出示學生證可免費搭乘校內公車。"],"href":"https://icard.uillinois.edu/","hrefLabel":"I-Card Office"},{"title":"McKinley 健康檢查","details":["建議在台灣完成所需疫苗接種與相關健康檢查，通常較便宜。","到 MyMcKinley 上傳 Covid-19 Vaccine Card、TB Screening Result、Medical History。","TB Screening 可在台灣家醫科 / 旅遊科完成；若到 MyMcKinley 做，開學第一週可能排隊較久。","若在 McKinley 做相關健檢，請攜帶護照、I-Card、相關文件、現金或 Debit / Credit Card。"],"href":"https://mymckinley.illinois.edu/","hrefLabel":"MyMcKinley"},{"title":"社會安全碼 SSN","details":["SSN 類似在美國的身分證號碼。","SSN 可降低買車、租車、考駕照、申請信用卡的門檻。","通常需要工作證明、immigration status 文件（I-20、I-94），再至 Social Security Administration Office 辦理。"],"href":"","hrefLabel":""},{"title":"設定 NetID 帳號","details":["NetID 用於校內網路資源、選課、線上圖書館、學校信箱等服務。","請至 NetID Claim 網站設定帳號。","若有問題可以聯繫 UIUC Technology Services。"],"href":"https://netidclaim.illinois.edu/","hrefLabel":"NetID Claim"}],"campusHousing":[{"title":"University Residence Hall","details":["Urbana North：Allen Hall、Busey-Evans、Illinois Street Residence Halls (ISR)、Lincoln Avenue Residence Halls (LAR)。","Urbana South：Florida Avenue Residence Halls (FAR)、Pennsylvania Avenue Residence Halls (PAR)。","Ikenberry Commons North：Barton and Lundgren、Hopkins、Nugent、Wassaja、Weston。","Ikenberry Commons South：Bousfield、Scott、Snyder、Taft-Van Doren。"],"href":"https://housing.illinois.edu/","hrefLabel":"University Residence Hall"},{"title":"Private Certified Housing","details":["選項包含 Armory House、Bromley Hall、Brown House on Coler、Evans Scholarship House、Hendrick House、Illini Chabad、Illini Tower、Koinonia、Nabor House、Newman Hall、Presby Hall、Stratford House、Sutton House。","大一新生通常需住學校宿舍或指定 private housing；收到通知後建議盡快登記，以免錯過想要的宿舍。"],"href":"https://certified.housing.illinois.edu/","hrefLabel":"Private Certified Housing"},{"title":"Dining Hall 宿舍餐廳","details":["住在 University Housing 通常必須搭配 Meal Plan。","一個 Meal 代表 Dining Hall 一餐，Credit 可在宿舍便利商店使用，也可用在 Dining Hall。","Meals 沒用完會在一個星期結束後重新計算，不會累計；Credit 則可以延期一個星期。"],"href":"https://housing.illinois.edu/dining","hrefLabel":"Dining"}],"schoolWebsites":[{"title":"MyIllini","details":["Account balance","Course schedule","Reminders from UIUC","Grades","Midterm / final schedule"]},{"title":"Self-Service","details":["Enhanced registration：prepare for registration、register for class、plan ahead、view schedule generator。","繳費：payment is due on the 28th，可使用 UI Pay online with e-check, credit card, or international wire。","Records and transcripts：查看 midterm and final grades、成績單。"]},{"title":"Course Explorer","details":["Class schedule、description、credit hours。","Course status、restriction、location、instructor。","Gen-Ed requirement。","Registration resources。"]},{"title":"Degree Audit","details":["可以看到自己 fulfill 了幾個學分，以及還缺哪些學分。","如果要轉系，可以選取其他科系並透過檢驗系統查看之後需要哪些學分。"]}],"parentPaymentSteps":[{"title":"Self-Service","details":["登入學生的 UIUC Self-Service account。","選取 Account Billing Information。"]},{"title":"UI-Pay","details":["點選 UI-Pay 進入線上繳費相關介面。"]},{"title":"Account Billing Information","details":["閱讀重要須知。","勾選 payment alert acknowledgement 旁的 check box。","點擊 continue。"]},{"title":"Payment Plans","details":["點選要繳交的項目。"]},{"title":"Authorize Payers","details":["如果要由父母或其他人付款，請在此處進行設定。","填寫 authorized payer 相關資訊即可完成。"]}],"legalInfo":[{"title":"SSN","details":["SSN 類似在美國的身分識別號碼，但不是所有新生一抵達就需要申請。","通常需要校內工作、助教研究助理職位，或其他符合資格的工作證明，才適合申請。","申請時通常會用到護照、I-20、I-94、工作證明，以及到 Social Security Administration Office 辦理。"],"href":"https://www.ssa.gov/number-card","hrefLabel":"Social Security Administration"},{"title":"Visa and F-1 Status","details":["簽證是入境美國用，F-1 status 則是在美期間要維持的學生身分。","請保管護照、簽證、I-20、I-94 等文件，並確認 I-20 上的資訊正確。","選課學分、校外工作、CPT / OPT、休學或轉學等問題，應以 ISSS 官方說明為準。"],"href":"https://isss.illinois.edu/students/incoming-students/","hrefLabel":"ISSS Incoming Students"},{"title":"I-94 and Immigration Records","details":["入境後可至官方 I-94 網站確認入境紀錄是否正確。","若姓名、入境日期、class of admission 或 admit until 資訊有誤，請盡快詢問 ISSS。","未來辦理 SSN、駕照、工作或身分相關事項時，I-94 常會被要求提供。"],"href":"https://i94.cbp.dhs.gov/","hrefLabel":"I-94 Official Website"},{"title":"Work Authorization","details":["F-1 學生工作規定很嚴格，請不要在未確認規則前接受校外 paid work。","On-campus employment、CPT、OPT 等類型規定不同，開始工作前務必確認資格與流程。","若不確定某個機會是否允許，先問 ISSS 或系上國際學生負責窗口。"],"href":"https://isss.illinois.edu/students/employment/","hrefLabel":"ISSS Employment"}],"recommendedSites":[{"label":"Grade Disparity","href":"https://waf.cs.illinois.edu/discovery/grade_disparity_between_sections_at_uiuc/"},{"label":"Rate My Professor","href":"https://www.ratemyprofessors.com/"},{"label":"UIUC Reddit","href":"https://www.reddit.com/r/UIUC/"}],"militaryService":[{"title":"役齡前出境","details":["於 Office of the Registrar 申請在學證明（Student Enrollment Verification）","將護照影本、申請表、申請費、回郵信封、在學證明寄至駐芝加哥辦事處驗證","返台後攜帶護照及驗證過的在學證明至內政部移民署辦理"]},{"title":"役齡後出境","details":["19 歲之年 1 月 1 日後出境需事先申請出境核准"]}]}'::jsonb);

insert into public.content_definition (key, definition) values ('features', '{"label":"Features","type":"object","fields":{"events":{"label":"Events","type":"boolean"},"incomingStudents":{"label":"Incoming Students","type":"boolean"},"marketplace":{"label":"Marketplace","type":"boolean"},"sublease":{"label":"Sublease","type":"boolean"},"carpool":{"label":"Carpool","type":"boolean"},"membership":{"label":"Membership","type":"boolean"},"merch":{"label":"Merch","type":"boolean"},"interns":{"label":"Interns","type":"boolean"},"sponsors":{"label":"Sponsors","type":"boolean"}}}'::jsonb);
insert into public.content_document (key, body) values ('features', '{"events":true,"incomingStudents":true,"marketplace":true,"sublease":true,"carpool":true,"membership":true,"merch":true,"interns":true,"sponsors":true}'::jsonb);

insert into public.content_definition (key, definition) values ('boards', '{"label":"Boards","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"description":{"label":"Description","type":"string","required":false,"multiline":true},"pinnedListings":{"label":"Pinned Listings","type":"array","item":{"label":"Item","type":"object","fields":{"title":{"label":"Title","type":"string","required":true,"multiline":false},"price":{"label":"Price","type":"string","required":false,"multiline":false},"contact":{"label":"Contact","type":"string","required":false,"multiline":false},"tag":{"label":"Tag","type":"string","required":false,"multiline":false},"description":{"label":"Description","type":"string","required":false,"multiline":true}}}}}}'::jsonb);
insert into public.content_document (key, body) values ('boards', '{"title":"Student Exchange Board","description":"二手買賣、轉租、拼車日期登記集中在這裡。完整列表與表單請進入各功能頁面。","pinnedListings":[{"title":"TSA Hoodie","price":"35","contact":"TSA Board","tag":"Merch","description":"Official TSA hoodie. Pickup details will be announced by TSA."},{"title":"TSA Sticker Pack","price":"5","contact":"TSA Board","tag":"Merch","description":"Taiwan and UIUC themed stickers from TSA."}]}'::jsonb);

-- Feature switches apply to direct Supabase clients as well as the website.
create function public.content_feature_enabled(feature text)
returns boolean language sql stable set search_path = public as $$
  select coalesce((select (body->>feature)::boolean from public.content_document where key = 'features'), true)
$$;



-- Migration: 20261021020000_event_content_management.sql
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



-- Migration: 20261021030000_listing_feature_visibility.sql
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


-- Migration: 20261021040000_preserve_main_content.sql
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



-- Migration: 20261021050000_preserve_main_calendar.sql
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
