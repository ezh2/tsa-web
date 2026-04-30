import "server-only";
import Link from "next/link";
import { listMyUpcomingRsvps } from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";

export async function MyUpcomingRsvps() {
  const rsvps = await listMyUpcomingRsvps();

  if (rsvps.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
        You haven&apos;t RSVP&apos;d to any upcoming events. Browse{" "}
        <Link href="/events" className="font-medium underline">
          upcoming events
        </Link>
        .
      </div>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {rsvps.map((r) => (
        <li key={r.event.id}>
          <Link
            href={`/events/${r.event.id}`}
            className="block px-5 py-4 transition hover:bg-neutral-50"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="truncate font-medium text-neutral-900">
                {r.event.title}
              </p>
              <span
                className={
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
                  (r.status === "going"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800")
                }
              >
                {r.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-600">
              {fmtDateRange(r.event.starts_at, r.event.ends_at)}
            </p>
            {r.event.location && (
              <p className="mt-0.5 text-xs text-neutral-500">
                📍 {r.event.location}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
