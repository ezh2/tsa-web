# UIUC TSA website

Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase. Public pages, student exchange boards, membership information, and event management share Supabase authentication and database permissions.

## Development

Copy `.env.example` to `.env.local` and set the URL and public anon key for your Supabase project. A hosted Supabase project does not require Docker. `npm run dev` connects to the project configured in those environment variables, so use a separate Supabase project for development if you do not want to edit live content.

```sh
npm install
npm run dev
```

## Website administration

Sign in with an account whose `public.profiles.role` is `admin`, then visit `/admin`.

- **Events:** create, edit, publish or unpublish, and delete events. Add an image, an information/registration link, capacity, a photo gallery, archive visibility, and times in Chicago, Taipei, or UTC.
- **Site settings:** edit the name, contact address, footer, and social links.
- **Home page:** edit the welcome text, resource cards, intern recognition, and recruitment copy.
- **About & people:** add, remove, and reorder board members, sponsors, and contributor credits.
- **Student guide:** edit orientation information, arrival guidance, and resource lists.
- **Membership and merchandise:** edit public descriptions, displayed pricing, partner discounts, images, translations, and the external store link. Displayed prices do not change charges in the external store. Stripe checkout remains paused.
- **Student boards:** edit the introduction and pinned TSA marketplace items. Community posts remain user-owned; admins can remove them on the boards.
- **Feature visibility:** show or hide existing features. Disabled events and listing boards also enforce availability through database policies. Creating new functionality still requires code.

Use **Publish changes** to make content live. Image uploads accept JPG, PNG, WebP, and GIF up to 5 MB and are publicly viewable. Editors detect outdated revisions to prevent overwriting another admin's changes.

### Hosted Supabase setup

After applying the `director` → `admin` role migration, choose one setup workflow:

1. **SQL Editor:** run the contents of `scripts/admin_setup.sql` once in the hosted project's SQL Editor. This transaction creates the content tables and image bucket, adds event publishing fields, preserves the current 21-event schedule and its photos and galleries, and applies feature policies. It preserves existing accounts, database events, and listings.
2. **CLI-managed migrations:** apply the six numbered migrations from `20261021010000` through `20261022000000` through your existing Supabase migration workflow instead of running the SQL bundle.

**Already ran the original setup (0100, 0200, 0300)?** Run `scripts/admin_merge_upgrade.sql` once instead of rerunning the full setup. It contains the three follow-up migrations (0400, 0500, and 0600), retaining admin edits while updating untouched public content and the event calendar. No hosted database changes happen when merging code; run the SQL bundle in the hosted SQL Editor to apply these updates.

The SQL Editor bundle does not update CLI migration history; do not subsequently reapply the same migrations with the CLI without reconciling that history. Regenerate the bundle after editing its source migrations:

```sh
node scripts/compose_admin_setup.mjs
```

Deploy the updated website after the database setup. Before setup, public content uses the existing content defaults and the dashboard disables publishing with a setup notice. Events require the event migration to support drafts and media.

## Structure

- `app/`: thin routes and protected layouts.
- `core/`: Supabase clients, authentication, roles, and profile helpers.
- `modules/content/`: document schemas, initial site content, admin editors, uploads, and content queries.
- `modules/events/`: event queries, mutations, admin forms, public pages, and RSVPs.
- `modules/listings/`: marketplace, sublease, and carpool boards.
- `modules/marketing/`: public page layouts consuming editable content.
- `modules/auth/`: sign-in, onboarding, and account pages.
- `modules/payments/`: paused Stripe implementation.
- `supabase/migrations/`: ordered deployment migrations. Module-specific SQL is mirrored under each module's `schemas/` directory.

New content tables use public read access and admin-only update policies. The database validates document shape, field limits, and safe URLs for direct API writes as well as website submissions. Upload permissions are also enforced by Supabase RLS. No service-role key is used by the editors or uploads.

## Checks

```sh
npm run typecheck
npm run lint
npm run test:content
npm run build
```

Content tests cover schema validation, safe links, admin publishing authorization, concurrent edits, local asset availability, and timezone/DST behavior. They use a mocked database client and do not replace testing migrations and Storage policies against Supabase. The production build needs access to Google Fonts for the existing Geist font configuration.
