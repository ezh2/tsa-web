import Link from "next/link";
import { listAllEvents } from "@/modules/events/server/queries";
import { EventsAdminList } from "./EventsAdminList";

function feedbackMessage(
  updated: string | undefined,
  deleted: string | undefined,
  bulkDeleted: string | undefined,
  error: string | undefined,
): { tone: "ok" | "err"; text: string } | null {
  if (error) return { tone: "err", text: error };
  if (bulkDeleted) return { tone: "ok", text: `Deleted ${bulkDeleted} events.` };
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
    bulkDeleted?: string;
    error?: string;
    created?: string;
  }>;
}) {
  const { updated, deleted, bulkDeleted, error, created } = await searchParams;
  const events = await listAllEvents();
  const feedback = created === "ok" ? { tone: "ok", text: "Event created." } : feedbackMessage(updated, deleted, bulkDeleted, error);
  const nowIso = new Date().toISOString();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Admin · Events
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
            Manage events
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            All events, newest first. Click a row to edit.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/events/import"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Import JSON
          </Link>
          <Link
            href="/admin/events/new"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            New event
          </Link>
        </div>
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
        <EventsAdminList events={events} nowIso={nowIso} />
      )}
    </main>
  );
}
