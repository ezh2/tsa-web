import Link from "next/link";
import { listAllEvents } from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";

function feedbackMessage(
  updated: string | undefined,
  deleted: string | undefined,
  error: string | undefined,
): { tone: "ok" | "err"; text: string } | null {
  if (error) return { tone: "err", text: error };
  if (deleted === "ok") return { tone: "ok", text: "Event deleted." };
  if (updated) return { tone: "ok", text: "Event updated." };
  return null;
}

export async function EventsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const { updated, deleted, error } = await searchParams;
  const events = await listAllEvents();
  const feedback = feedbackMessage(updated, deleted, error);
  const nowIso = new Date().toISOString();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Director · Events
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
            Manage events
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            All events, newest first. Click a row to edit.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          New event
        </Link>
      </header>

      {feedback && (
        <div
          role={feedback.tone === "err" ? "alert" : "status"}
          className={
            "mt-6 rounded-md border px-3 py-2 text-sm " +
            (feedback.tone === "err"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800")
          }
        >
          {feedback.text}
        </div>
      )}

      {events.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center text-sm text-neutral-500">
          No events yet. Create the first one.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {events.map((event) => {
            const isPast = event.starts_at < nowIso;
            return (
              <li key={event.id}>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="block rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      {event.title}
                    </h2>
                    <div className="flex shrink-0 items-baseline gap-3 text-xs text-neutral-500">
                      {isPast && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium uppercase tracking-wider text-neutral-600">
                          Past
                        </span>
                      )}
                      {event.location && <span>{event.location}</span>}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    {fmtDateRange(event.starts_at, event.ends_at)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
