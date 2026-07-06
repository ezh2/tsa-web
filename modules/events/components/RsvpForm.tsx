import { rsvpAction, removeRsvpAction } from "@/modules/events/server/actions";
import type { RsvpRecord } from "@/modules/events/types";

const btnPrimary =
  "rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700";
const btnSecondary =
  "rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100";

export function RsvpForm({
  eventId,
  current,
  compact = false,
}: {
  eventId: string;
  current: RsvpRecord | null;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "space-y-3"
          : "space-y-3 rounded-xl border border-neutral-200 bg-white p-5"
      }
    >
      {!compact && (
        <p className="text-sm font-medium text-neutral-900">
          {current
            ? `Your RSVP: ${current.status === "going" ? "Going" : "Maybe"}`
            : "Will you attend?"}
        </p>
      )}
      <div className="flex flex-wrap gap-2" aria-label="RSVP options">
        <form action={rsvpAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <input type="hidden" name="status" value="going" />
          <button
            type="submit"
            className={current?.status === "going" ? btnSecondary : btnPrimary}
          >
            Going
          </button>
        </form>
        <form action={rsvpAction}>
          <input type="hidden" name="event_id" value={eventId} />
          <input type="hidden" name="status" value="maybe" />
          <button
            type="submit"
            className={current?.status === "maybe" ? btnSecondary : btnPrimary}
          >
            Maybe
          </button>
        </form>
        {current && (
          <form action={removeRsvpAction}>
            <input type="hidden" name="event_id" value={eventId} />
            <button type="submit" className={btnSecondary}>
              Remove RSVP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
