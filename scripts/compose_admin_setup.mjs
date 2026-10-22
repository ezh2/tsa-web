import { readFileSync, writeFileSync } from "node:fs";

const migrations = [
  "20261021010000_init_website_content.sql",
  "20261021020000_event_content_management.sql",
  "20261021030000_listing_feature_visibility.sql",
  "20261021040000_preserve_main_content.sql",
  "20261021050000_preserve_main_calendar.sql",
  "20261022000000_sync_latest_public_updates.sql",
];
const header = `-- Run ONCE in the hosted Supabase SQL Editor after the admin-role rename.
-- Contains the six website-management migrations below, in dependency order.
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

`;
writeFileSync("scripts/admin_setup.sql", header + migrations.map((file) => `-- Migration: ${file}\n` + readFileSync(`supabase/migrations/${file}`, "utf8")).join("\n\n") + "\ncommit;\n");
const upgradeHeader = "-- For projects that ALREADY ran the original admin_setup.sql (0100, 0200, 0300).\n-- Run once in the hosted SQL Editor. Fresh installations use admin_setup.sql.\nbegin;\n\n";
writeFileSync("scripts/admin_merge_upgrade.sql", upgradeHeader + migrations.slice(-3).map((file) => `-- Migration: ${file}\n` + readFileSync(`supabase/migrations/${file}`, "utf8")).join("\n\n") + "\ncommit;\n");
console.log("Wrote scripts/admin_setup.sql and scripts/admin_merge_upgrade.sql");
