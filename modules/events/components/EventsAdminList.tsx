"use client";

import Link from "next/link";
import { useState } from "react";
import type { EventRecord } from "../types";
import { fmtEventDate } from "../lib/format";
import { deleteEventsAction } from "../server/actions";

export function EventsAdminList({ events, nowIso }: { events: EventRecord[]; nowIso: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = selected.size === events.length;

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(events.map((event) => event.id)) : new Set());
  }

  return (
    <form
      action={deleteEventsAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${selected.size} selected events? This cannot be undone. RSVPs will also be removed.`)) {
          event.preventDefault();
        }
      }}
    >
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) => toggleAll(event.target.checked)}
            className="h-4 w-4 accent-neutral-900"
            aria-label="Select all events"
          />
          Select all
        </label>
        <button
          type="submit"
          disabled={selected.size === 0}
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete selected ({selected.size})
        </button>
      </div>

      {[...selected].map((id) => <input key={id} type="hidden" name="ids" value={id} />)}

      <ul className="mt-3 space-y-3">
        {events.map((event) => {
          const isPast = event.starts_at < nowIso;
          return (
            <li key={event.id} className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-sm">
              <input
                type="checkbox"
                checked={selected.has(event.id)}
                onChange={(change) => setSelected((current) => {
                  const next = new Set(current);
                  if (change.target.checked) next.add(event.id);
                  else next.delete(event.id);
                  return next;
                })}
                className="h-4 w-4 shrink-0 accent-neutral-900"
                aria-label={`Select ${event.title} for deletion`}
              />
              <Link href={`/admin/events/${event.id}/edit`} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-4">
                  <h2 className="text-lg font-semibold text-neutral-900">{event.title}</h2>
                  <div className="flex flex-wrap items-baseline gap-2 text-xs text-neutral-500">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5">{event.is_published ? "Published" : "Draft"}</span>
                    {isPast && <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium uppercase tracking-wider text-neutral-600">Past</span>}
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>
                <p className="mt-1 text-sm text-neutral-600">{fmtEventDate(event)}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </form>
  );
}
