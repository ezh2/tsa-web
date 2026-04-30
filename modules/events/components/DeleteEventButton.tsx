"use client";

import { deleteEventAction } from "@/modules/events/server/actions";

export function DeleteEventButton({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  return (
    <form
      action={deleteEventAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete "${eventTitle}"? This cannot be undone. RSVPs will be removed.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={eventId} />
      <button
        type="submit"
        className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Delete event
      </button>
    </form>
  );
}
