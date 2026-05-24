import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { hasRole } from "@/core/rbac";
import { getCurrentUser } from "@/core/rbac/server";
import {
  listMyRsvpsForEvents,
  listUpcomingEvents,
} from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";
import { STATIC_UPCOMING_EVENTS } from "@/modules/events/data/upcoming";
import { RsvpForm } from "./RsvpForm";
import bentoChicken from "@/images/events/2526/bento/bento_chicken.jpg";
import bentoSausage from "@/images/events/2526/bento/bento_sausage.jpg";

type PastEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  images?: {
    src: StaticImageData;
    alt: string;
  }[];
};

const PAST_EVENTS: PastEvent[] = [
  {
    title: "Taiwanese Bento",
    date: "April 18, 2026",
    time: "13:30 - 16:00",
    location: "Anniversary Plaza",
    description:
      "Enjoy a familiar Taiwanese bento on campus. Pick up your preorder at Anniversary Plaza on the Illini Union Main Quad side and bring a taste of Taiwan into your weekend.",
    images: [
      {
        src: bentoChicken,
        alt: "Taiwanese chicken bento meal box",
      },
      {
        src: bentoSausage,
        alt: "Taiwanese sausage bento meal box",
      },
    ],
  },
  {
    title: "Lunar New Year Banquet",
    date: "February 14, 2026",
    time: "Time announced through TSA Linktree",
    location: "Golden Harbor / 漁滿樓",
    description:
      "Celebrate Lunar New Year with TSA at Golden Harbor. Join us for Taiwanese cuisine, time with friends, and our annual raffle draw.",
  },
  {
    title: "TSA Singing Contest",
    date: "November 15, 2025",
    time: "20:30",
    location: "Illini Room A",
    description:
      "Showcase your voice at the TSA Singing Contest. We are excited to welcome performers and friends for a night of music, stage energy, and community support.",
  },
];

export async function EventsListPage() {
  const events = await listUpcomingEvents().catch((error) => {
    unstable_rethrow(error);
    console.error("Unable to load upcoming events", error);
    return [];
  });
  const user = await getCurrentUser();
  const rsvps = user
    ? await listMyRsvpsForEvents(events.map((event) => event.id))
    : [];
  const rsvpByEventId = new Map(
    rsvps.map((rsvp) => [rsvp.event_id, rsvp] as const),
  );
  const canRsvp = user && hasRole(user.role, "member");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <header className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          What&apos;s coming up
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-6xl font-semibold tracking-tight text-neutral-900 sm:text-7xl">
          Events
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
          Browse UIUC TSA events, from campus traditions and cultural gatherings
          to student-led socials, fundraisers, and performance nights.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <li key={event.id}>
            <article className="h-full rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm">
              <Link href={`/events/${event.id}`} className="block">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {fmtDateRange(event.starts_at, event.ends_at)}
                </p>
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {event.title}
                  </h2>
                  {event.location && (
                    <span className="shrink-0 text-xs text-neutral-500">
                      📍 {event.location}
                    </span>
                  )}
                </div>
              </Link>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                {canRsvp ? (
                  <RsvpForm
                    eventId={event.id}
                    current={rsvpByEventId.get(event.id) ?? null}
                    compact
                  />
                ) : !user ? (
                  <Link
                    href={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`}
                    className="inline-flex rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                  >
                    Sign in to RSVP
                  </Link>
                ) : (
                  <p className="text-sm text-neutral-600">
                    RSVP is open to verified members.
                  </p>
                )}
              </div>
            </article>
          </li>
        ))}

        {STATIC_UPCOMING_EVENTS.map((event) => (
          <li key={`${event.date}-${event.title}`}>
            <article className="h-full rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {event.date} · {event.time}
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {event.title}
                </h2>
                <span className="shrink-0 rounded-md bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {event.location}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {event.description}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <section className="mt-20 border-t border-neutral-100 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Archive
        </p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          Past Events
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          A quick record of recent TSA events, announcements, and community
          gatherings.
        </p>

        <div className="mt-8 space-y-4">
          {PAST_EVENTS.map((event) => (
            <article
              key={event.title}
              className="flex flex-col gap-6 rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      {event.date}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                      {event.title}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-md bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {event.location}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  {event.description}
                </p>
              </div>
              {event.images && (
                <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:w-56">
                  {event.images.map((image) => (
                    <Image
                      key={image.alt}
                      src={image.src}
                      alt={image.alt}
                      className="aspect-[3/4] w-full rounded-md object-cover"
                      sizes="(min-width: 640px) 112px, calc((100vw - 72px) / 2)"
                    />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
