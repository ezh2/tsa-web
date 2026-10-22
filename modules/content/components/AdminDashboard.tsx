import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { requireRole } from "@/core/rbac/server";
import { listEventsForAdmin } from "@/modules/events";
import { DEFAULT_CONTENT } from "../lib/defaults";
import { CONTENT_LABELS, isContentKey } from "../lib/schema";
import { getContentState } from "../server/queries";
import { ContentEditor } from "./ContentEditor";

export async function AdminDashboard({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const user = await requireRole("admin");
  const { section = "overview" } = await searchParams;
  const [content, events] = await Promise.all([
    getContentState(),
    listEventsForAdmin().catch((error) => { unstable_rethrow(error); console.warn("Admin events unavailable", error); return null; }),
  ]);
  const active = isContentKey(section) ? section : null;
  const row = active ? content.rows.find((row) => row.key === active) ?? { key: active, body: DEFAULT_CONTENT[active], revision: 1, updated_at: "" } : null;
  const upcoming = (events ?? []).filter((event) => new Date(event.starts_at) >= new Date());
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Website management</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Your TSA, up to date.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">Publish events, update your pages, and choose what your community sees.</p></div><p className="text-sm text-neutral-500">{user.display_name ?? user.email}</p></header>
      {!content.ready && <div role="alert" className="mb-8 rounded-md border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><strong>Website content setup is required.</strong> Apply the new website content migration in your hosted Supabase project. Your existing website stays available; publishing is disabled until setup is complete.</div>}
      <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
        <aside><nav aria-label="Website sections" className="sticky top-28 flex flex-col gap-1"><SidebarLink href="/admin" active={!active}>Overview</SidebarLink><SidebarLink href="/admin/events" active={false}>Events ↗</SidebarLink><p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Content & settings</p>{Object.entries(CONTENT_LABELS).map(([key, info]) => <SidebarLink key={key} href={`/admin?section=${key}`} active={active === key}>{info.label}</SidebarLink>)}</nav></aside>
        {active && row ? <ContentEditor key={active} documentKey={active} row={row} disabled={!content.ready} /> : <div className="min-w-0">
          <div className="grid gap-4 sm:grid-cols-3">{[{ label: "Upcoming events", value: events ? upcoming.length : "—" }, { label: "Published pages", value: content.ready ? content.rows.length - 1 : "Setup needed" }, { label: "Your access", value: "Admin" }].map((stat) => <div key={stat.label} className="rounded-md border border-neutral-200 bg-white p-5"><p className="text-xs font-medium text-neutral-500">{stat.label}</p><p className="mt-3 text-2xl font-semibold">{stat.value}</p></div>)}</div>
          <section className="mt-8 rounded-md border border-neutral-200 bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Events</h2><p className="mt-2 text-sm text-neutral-600">Create an event once. It appears on the home page and event calendar.</p></div><Link href="/admin/events/new" className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">+ New event</Link></div><div className="mt-6 divide-y divide-neutral-100">{events === null ? <p className="py-4 text-sm text-red-700">Events could not be loaded. Check your Supabase connection.</p> : events.length === 0 ? <p className="py-4 text-sm text-neutral-500">No events yet. Add your first event to get started.</p> : events.slice(0, 5).map((event) => <Link key={event.id} href={`/admin/events/${event.id}/edit`} className="flex items-center justify-between gap-4 py-4 text-sm"><span className="font-medium">{event.title}</span><span className="shrink-0 text-xs text-neutral-500">{event.is_published ? "Published" : "Draft"} · Edit →</span></Link>)}</div><Link href="/admin/events" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Manage all events</Link></section>
          <h2 className="mb-4 mt-10 text-xl font-semibold">Edit Page</h2><div className="grid gap-4 sm:grid-cols-2">{Object.entries(CONTENT_LABELS).map(([key, info]) => <Link key={key} href={`/admin?section=${key}`} className="rounded-md border border-neutral-200 bg-white p-5 transition hover:border-neutral-400"><h3 className="font-semibold">{info.label} →</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{info.description}</p></Link>)}</div>
        </div>}
      </div>
    </main>
  );
}

function SidebarLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={`rounded-md px-3 py-2.5 text-sm transition ${active ? "bg-neutral-900 font-semibold text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>{children}</Link>;
}
