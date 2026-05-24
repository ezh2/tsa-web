import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { STATIC_UPCOMING_EVENTS } from "@/modules/events/data/upcoming";
import { listUpcomingEvents } from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";

export async function EventsPreview() {
  const events = await listUpcomingEvents().catch((error) => {
    unstable_rethrow(error);
    console.error("Unable to load upcoming events preview", error);
    return [];
  });
  const staticEvents = STATIC_UPCOMING_EVENTS.slice(
    0,
    Math.max(0, 3 - events.length),
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            What&apos;s next
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Upcoming events
          </h2>
        </div>
        <Link
          href="/events"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          View all →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.slice(0, 3).map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group flex min-h-64 flex-col rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {fmtDateRange(event.starts_at, event.ends_at)}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900 group-hover:underline">
              {event.title}
            </h3>
            {event.location && (
              <p className="mt-1 text-sm text-neutral-600">
                📍 {event.location}
              </p>
            )}
            {event.description && (
              <p className="mt-3 line-clamp-3 text-sm text-neutral-600">
                {event.description}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
              Details →
            </span>
          </Link>
        ))}

        {staticEvents.map((event) => (
          <Link
            key={event.title}
            href="/events"
            className="group flex min-h-64 flex-col rounded-md border border-black/10 bg-white/85 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {event.date} · {event.time}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900 group-hover:underline">
              {event.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{event.location}</p>
            <p className="mt-3 line-clamp-3 text-sm text-neutral-600">
              {event.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
              View calendar →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
