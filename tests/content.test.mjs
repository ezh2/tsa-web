import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real shared validators without a running Next.js server.
function loadTs(file, imports = {}) {
  const exports = {};
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  vm.runInNewContext(outputText, { exports, URL, require: (key) => {
    if (!(key in imports)) throw new Error(`Unexpected dependency: ${key}`);
    return imports[key];
  }});
  return exports;
}
const defaults = loadTs('modules/content/lib/defaults.ts');
const schema = loadTs('modules/content/lib/schema.ts', { './defaults': defaults });
const { CONTENT_SCHEMAS, validateContent, isSafeContentUrl } = schema;
const { eventLocalToIso, eventLocalInput } = loadTs('modules/events/lib/timezone.ts');

test('all existing site content can be published without losing its data', () => {
  for (const [key, value] of Object.entries(defaults.DEFAULT_CONTENT)) assert.equal(validateContent(value, CONTENT_SCHEMAS[key]), null, key);
});

test('content links reject executable schemes, credentials, and protocol-relative URLs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,<script>', '//evil.example', '/\\evil.example', 'https://user:pass@example.com', 'https://example.com\n', 'file:///etc/passwd']) assert.equal(isSafeContentUrl(url), false, url);
  for (const url of ['https://example.com/path?q=1', 'http://localhost:3000', '/about#board', '#board', 'mailto:tsa@example.com']) assert.equal(isSafeContentUrl(url), true, url);
  assert.equal(isSafeContentUrl('mailto:tsa@example.com', true), false);
});

test('direct API payloads must have the expected fields and types', () => {
  const features = { ...defaults.DEFAULT_CONTENT.features };
  assert.ok(validateContent({ ...features, events: 'false' }, CONTENT_SCHEMAS.features));
  assert.ok(validateContent({ ...features, unknown: true }, CONTENT_SCHEMAS.features));
  delete features.events;
  assert.ok(validateContent(features, CONTENT_SCHEMAS.features));
  assert.ok(validateContent({ ...defaults.DEFAULT_CONTENT.home, title: '' }, CONTENT_SCHEMAS.home));
});

test('admins can add and clear repeatable content while unsafe image URLs are rejected', () => {
  const about = structuredClone(defaults.DEFAULT_CONTENT.about);
  about.board = [];
  assert.equal(validateContent(about, CONTENT_SCHEMAS.about), null);
  about.board.push({ name: 'New board member', role: 'Secretary', photo: 'https://example.com/photo.png' });
  assert.equal(validateContent(about, CONTENT_SCHEMAS.about), null);
  about.board[0].photo = 'javascript:alert(1)';
  assert.ok(validateContent(about, CONTENT_SCHEMAS.about));
});

test('event wall-clock times use their selected timezone in winter, summer, and Taiwan', () => {
  assert.equal(eventLocalToIso('2027-01-23T18:00', 'America/Chicago'), '2027-01-24T00:00:00.000Z');
  assert.equal(eventLocalToIso('2026-08-22T16:00', 'America/Chicago'), '2026-08-22T21:00:00.000Z');
  assert.equal(eventLocalToIso('2026-06-27T10:00', 'Asia/Taipei'), '2026-06-27T02:00:00.000Z');
  assert.equal(eventLocalInput('2026-06-27T02:00:00.000Z', 'Asia/Taipei'), '2026-06-27T10:00');
});

test('nonexistent DST times and invalid calendar dates are rejected', () => {
  assert.throws(() => eventLocalToIso('2027-03-14T02:30', 'America/Chicago'));
  assert.throws(() => eventLocalToIso('2026-02-31T12:00', 'UTC'));
  assert.throws(() => eventLocalToIso('not a date', 'UTC'));
});

test('module schemas match deployment migrations', () => {
  for (const [schema, migration] of [
    ['modules/content/schemas/0001_init.sql', 'supabase/migrations/20261021010000_init_website_content.sql'],
    ['modules/events/schemas/0002_content_management.sql', 'supabase/migrations/20261021020000_event_content_management.sql'],
    ['modules/listings/schemas/0002_feature_visibility.sql', 'supabase/migrations/20261021030000_listing_feature_visibility.sql'],
    ['modules/content/schemas/0002_preserve_main_content.sql', 'supabase/migrations/20261021040000_preserve_main_content.sql'],
    ['modules/events/schemas/0003_preserve_main_calendar.sql', 'supabase/migrations/20261021050000_preserve_main_calendar.sql'],
  ]) assert.equal(fs.readFileSync(schema, 'utf8'), fs.readFileSync(migration, 'utf8'));
});

test('the hosted SQL Editor setup bundle matches the numbered migrations', () => {
  const bundle = fs.readFileSync('scripts/admin_setup.sql', 'utf8');
  for (const file of ['20261021010000_init_website_content.sql', '20261021020000_event_content_management.sql', '20261021030000_listing_feature_visibility.sql', '20261021040000_preserve_main_content.sql', '20261021050000_preserve_main_calendar.sql']) assert.ok(bundle.includes(fs.readFileSync('supabase/migrations/' + file, 'utf8')), file);
  assert.match(bundle, /begin;/);
  assert.ok(bundle.trimEnd().endsWith('commit;'));
});

test('every built-in content image exists in the deployed public directory', () => {
  function inspect(value) {
    if (typeof value === 'string' && value.startsWith('/content/')) assert.ok(fs.existsSync('public' + value), value);
    else if (Array.isArray(value)) value.forEach(inspect);
    else if (value && typeof value === 'object') Object.values(value).forEach(inspect);
  }
  inspect(defaults.DEFAULT_CONTENT);
});

function publishingFixture(role = 'admin') {
  const record = { key: 'home', body: structuredClone(defaults.DEFAULT_CONTENT.home), revision: 1 };
  const supabase = { from: () => {
    let patch;
    const filters = {};
    const query = {
      update(value) { patch = value; return query; },
      eq(key, value) { filters[key] = value; return query; },
      select() { return query; },
      async maybeSingle() {
        if (filters.key !== record.key || filters.revision !== record.revision) return { data: null, error: null };
        record.body = patch.body; record.revision++;
        return { data: { revision: record.revision }, error: null };
      },
    };
    return query;
  }};
  const { saveContentAction } = loadTs('modules/content/server/actions.ts', {
    'next/cache': { revalidatePath() {} },
    '@/core/rbac/server': { async requireRole() { if (role !== 'admin') throw new Error('Forbidden'); } },
    '@/core/supabase/server': { async createClient() { return supabase; } },
    '../lib/schema': schema,
  });
  function form(body, revision = 1) {
    const data = new FormData();
    data.set('key', 'home'); data.set('body', JSON.stringify(body)); data.set('revision', String(revision));
    return data;
  }
  return { record, saveContentAction, form };
}

test('publishing refuses non-admin callers before touching content', async () => {
  const fixture = publishingFixture('member');
  await assert.rejects(() => fixture.saveContentAction({}, fixture.form({ ...fixture.record.body, title: 'Unauthorized' })), /Forbidden/);
  assert.equal(fixture.record.revision, 1);
});

test('publishing updates content and rejects an outdated editor without overwriting the newer change', async () => {
  const fixture = publishingFixture();
  const first = await fixture.saveContentAction({}, fixture.form({ ...fixture.record.body, title: 'Published title' }));
  assert.equal(first.ok, true); assert.equal(first.revision, 2);
  const stale = await fixture.saveContentAction({}, fixture.form({ ...fixture.record.body, title: 'Stale title' }));
  assert.equal(stale.ok, false); assert.match(stale.message, /Another admin/);
  assert.equal(fixture.record.body.title, 'Published title');
});

test('publishing rejects an unsafe URL without writing to the database', async () => {
  const fixture = publishingFixture();
  const body = structuredClone(fixture.record.body);
  body.lifeSections[0].href = 'javascript:alert(1)';
  const result = await fixture.saveContentAction({}, fixture.form(body));
  assert.equal(result.ok, false); assert.equal(fixture.record.revision, 1);
});

test('a validation failure preserves the saved revision so a corrected edit can publish', async () => {
  const fixture = publishingFixture();
  const saved = await fixture.saveContentAction({}, fixture.form({ ...fixture.record.body, title: 'First update' }));
  const invalid = { ...fixture.record.body, title: '' };
  const failed = await fixture.saveContentAction(saved, fixture.form(invalid, saved.revision));
  assert.equal(failed.ok, false); assert.equal(failed.revision, 2);
  const corrected = await fixture.saveContentAction(failed, fixture.form({ ...invalid, title: 'Corrected update' }, failed.revision));
  assert.equal(corrected.ok, true); assert.equal(corrected.revision, 3);
});

const calendar = loadTs('modules/events/lib/calendar.ts');
const eventSnapshot = JSON.parse(fs.readFileSync('modules/events/data/default-events.json', 'utf8'));
const seededRecord = (event) => ({ ...event, id: 'static-' + event.source_key });

test('the calendar retains the corrected National Day venue, date, and full BBQ gallery', () => {
  const nationalDay = calendar.toCalendarEvent(seededRecord(eventSnapshot.find((event) => event.title === 'National Day Celebration')));
  assert.equal(nationalDay.date, 'October 10, 2026');
  assert.equal(nationalDay.time, '10:30 PM');
  assert.equal(nationalDay.location, "Joe's Brewery Champaign");
  const bbq = eventSnapshot.find((event) => event.title === '中秋烤肉');
  assert.equal(bbq.image_gallery.length, 3);
  assert.equal(calendar.toCalendarEvent(seededRecord(bbq)).date, 'September 27, 2026');
  const keys = eventSnapshot.map((event) => event.source_key);
  assert.equal(new Set(keys).size, 20);
  const getEvent = (title) => eventSnapshot.find((event) => event.title === title);
  assert.equal(getEvent('Game Day').starts_at, '2026-11-13T23:30:00.000Z');
  assert.equal(getEvent('Singing Contest').starts_at, '2027-02-01T18:00:00.000Z');
  assert.equal(getEvent('Taiwanese Bento').starts_at, '2027-03-01T19:30:00.000Z');
  assert.equal(getEvent('Water Balloon Battle').starts_at, '2027-04-01T05:00:00.000Z');
  assert.equal(getEvent('Hot Choco Sale'), undefined);
  for (const event of eventSnapshot) for (const image of [event.image_url, ...event.image_gallery.map((image) => image.src)]) {
    if (image.startsWith('/content/')) assert.ok(fs.existsSync('public' + image), image);
  }
});

test('calendar day boundaries use Chicago time and preserve archive visibility', () => {
  const events = eventSnapshot.map(seededRecord).map(calendar.toCalendarEvent);
  const boundary = calendar.splitCalendarEvents(events, new Date('2026-10-11T02:00:00Z'));
  assert.ok(boundary.upcoming.some((event) => event.title === 'National Day Celebration'));
  const afterMidnight = calendar.splitCalendarEvents(events, new Date('2026-10-11T06:00:00Z'));
  assert.ok(afterMidnight.past.some((event) => event.title === 'National Day Celebration'));
  assert.ok(!afterMidnight.past.some((event) => event.title === 'Welcome Picnic'));
});

test('membership defaults preserve current confirmed benefits, pricing, people, and sponsors', () => {
  const content = defaults.DEFAULT_CONTENT;
  assert.equal(content.site.name, 'TSA UIUC');
  assert.equal(content.merch.bundlePrice, '$49.99');
  const partners = content.membership.partners.filter((partner) => partner.confirmed);
  assert.equal(partners.length, 2);
  const restaurantPartners = partners.find((partner) => partner.name === 'Restaurant Partners');
  assert.match(restaurantPartners.offer, /10% off/);
  assert.equal(restaurantPartners.venues.length, 4);
  const latea = partners.find((partner) => partner.name === 'LaTea');
  assert.match(latea.offer, /10% off/);
  assert.match(latea.additionalOffer, /Early access/);
  assert.deepEqual(Array.from(content.home.interns, (intern) => intern.name), ['Barron Tsai', 'Ryan Hsu']);
  assert.ok(content.about.board.find((person) => person.name === 'Burton Wang').photo);
  assert.deepEqual(Array.from(content.about.sponsors, (sponsor) => sponsor.name), [
    'TSMC (台灣積體電路製造)',
    'LaTea',
    'Weee',
    'Taipei Economics Cultural Office Chicago',
    'bb.q Chicken',
    'Pokelab',
    'SGD Dubu',
    'Susuru Ramen',
  ]);
  assert.equal(content.about.sponsors.find((sponsor) => sponsor.name === 'Taipei Economics Cultural Office Chicago').logo, '/content/roc-flag.webp');
});

function publicCalendarFixture(data, error = null) {
  const query = { select() { return query; }, eq() { return query; }, async order() { return { data, error }; } };
  return loadTs('modules/events/server/queries.ts', {
    'server-only': {},
    'react': { cache: (fn) => fn },
    'next/navigation': { unstable_rethrow() {} },
    '../data/default-events.json': { default: eventSnapshot },
    '../lib/calendar': calendar,
    '@/core/supabase/server': { async createClient() { return { from() { return query; } }; } },
    '@/core/rbac/server': {},
  });
}

test('an empty published database stays empty instead of resurrecting deleted events', async () => {
  const { listPublicCalendarEvents } = publicCalendarFixture([]);
  assert.equal((await listPublicCalendarEvents()).length, 0);
});

test('published database edits replace the original calendar without duplicates', async () => {
  const published = { ...eventSnapshot[0], id: 'a-real-database-id', title: 'Updated by an admin', is_published: true };
  const { listPublicCalendarEvents } = publicCalendarFixture([published]);
  const events = await listPublicCalendarEvents();
  assert.equal(events.length, 1);
  assert.equal(events[0].title, 'Updated by an admin');
  assert.equal(events[0].detailsHref, '/events/a-real-database-id');
});
