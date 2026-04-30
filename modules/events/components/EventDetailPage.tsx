import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/core/rbac/server";
import { hasRole } from "@/core/rbac";
import { getEventById, getMyRsvp } from "@/modules/events/server/queries";
import { fmtDateRange } from "@/modules/events/lib/format";
import { RsvpForm } from "./RsvpForm";

function feedbackMessage(
  rsvp: string | undefined,
  error: string | undefined,
): { tone: "ok" | "err"; text: string } | null {
  if (error) return { tone: "err", text: error };
  if (rsvp === "ok") return { tone: "ok", text: "RSVP saved." };
  if (rsvp === "removed") return { tone: "ok", text: "RSVP removed." };
  return null;
}

export async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rsvp?: string; error?: string }>;
}) {
  const { id } = await params;
  const { rsvp, error } = await searchParams;

  const event = await getEventById(id);
  if (!event) notFound();

  const user = await getCurrentUser();
  const myRsvp = user ? await getMyRsvp(event.id) : null;
  const canRsvp = user && hasRole(user.role, "member");
  const feedback = feedbackMessage(rsvp, error);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-neutral-600 hover:text-neutral-900"
      >
        ← All events
      </Link>

      <article className="mt-6 space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {fmtDateRange(event.starts_at, event.ends_at)}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
            {event.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
            {event.location && <span>📍 {event.location}</span>}
            {event.capacity != null && (
              <span>Capacity: {event.capacity}</span>
            )}
          </div>
        </header>

        {event.description && (
          <p className="whitespace-pre-wrap text-base leading-7 text-neutral-700">
            {event.description}
          </p>
        )}

        {feedback && (
          <div
            role={feedback.tone === "err" ? "alert" : "status"}
            className={
              feedback.tone === "err"
                ? "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            }
          >
            {feedback.text}
          </div>
        )}

        {canRsvp ? (
          <RsvpForm eventId={event.id} current={myRsvp} />
        ) : !user ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
            <Link href="/login" className="font-medium underline">
              Sign in
            </Link>{" "}
            to RSVP for this event.
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
            RSVP is open to verified members. Reach out at the next event to get
            membership.
          </div>
        )}
      </article>
    </main>
  );
}
