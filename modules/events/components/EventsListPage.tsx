import Image from "next/image";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import { requireSiteFeature } from "@/modules/content";
import { listMyRsvpsForEvents, listPastEvents, listUpcomingEvents } from "../server/queries";
import { fmtEventDate } from "../lib/format";
import type { EventRecord } from "../types";
import { RsvpForm } from "./RsvpForm";

export async function EventsListPage() {
  await requireSiteFeature("events");
  const failed = (error: unknown): null => { unstable_rethrow(error); console.warn("Events unavailable", error); return null; };
  const [upcomingResult, pastResult, user] = await Promise.all([listUpcomingEvents().catch(failed), listPastEvents().catch(failed), getCurrentUser()]);
  const unavailable = upcomingResult === null || pastResult === null;
  const events = upcomingResult ?? [], pastEvents = pastResult ?? [];
  const rsvps = user ? await listMyRsvpsForEvents(events.map((event) => event.id)) : [];
  const rsvpByEventId = new Map(rsvps.map((rsvp) => [rsvp.event_id, rsvp]));
  const canRsvp = user && hasRole(user.role, "member");
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <header className="mb-12 text-center"><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">What&apos;s coming up</p><h1 className="mt-3 text-6xl font-semibold tracking-tight sm:text-7xl">Events</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Campus traditions, cultural gatherings, and time together. Find your next TSA event here.</p></header>
      {unavailable && <p role="status" className="mb-6 rounded-md border bg-white p-5 text-sm">Events are temporarily unavailable. Please check back soon.</p>}
      {!unavailable && events.length === 0 && <p className="rounded-md border border-dashed p-10 text-center text-sm text-neutral-500">No upcoming events yet. Check back for our next announcement.</p>}
      <ul className="grid gap-5 md:grid-cols-2">{events.map((event) => <li key={event.id}><article className="h-full overflow-hidden rounded-md border border-neutral-200 bg-white">
        <EventSummary event={event} />
        <div className="mx-6 mb-6 border-t border-neutral-100 pt-4">{canRsvp ? <RsvpForm eventId={event.id} current={rsvpByEventId.get(event.id) ?? null} compact /> : !user ? <Link href={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`} className="text-sm font-medium underline underline-offset-4">Sign in to RSVP</Link> : <p className="text-sm text-neutral-600">RSVP is open to verified members.</p>}</div>
      </article></li>)}</ul>
      <section className="mt-16 border-t pt-12"><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Archive</p><h2 className="mt-2 text-4xl font-semibold">Past events</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{pastEvents.map((event) => <article key={event.id} className="overflow-hidden rounded-md border border-neutral-200 bg-white"><EventSummary event={event} /></article>)}</div></section>
    </main>
  );
}

function EventSummary({ event }: { event: EventRecord }) {
  return <Link href={`/events/${event.id}`} className="group block">
    {event.image_url && <Image unoptimized src={event.image_url} alt={event.title} width={800} height={450} className="aspect-video w-full bg-neutral-50 object-contain" />}
    <div className="p-6"><p className="text-xs font-medium text-neutral-500">{fmtEventDate(event)}</p><h2 className="mt-3 text-xl font-semibold group-hover:underline">{event.title}</h2>{event.location && <p className="mt-2 text-sm text-neutral-600">{event.location}</p>}{event.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">{event.description}</p>}<span className="mt-5 inline-block text-sm font-medium">View event →</span></div>
  </Link>;
}
