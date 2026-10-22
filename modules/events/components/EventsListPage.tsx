import { requireSiteFeature } from "@/modules/content";
import { listPublicCalendarEvents } from "../server/queries";
import { calendarToday, splitCalendarEvents, type CalendarEvent } from "../lib/calendar";
import { EventCard } from "./EventCard";

type CalendarEventGroup = { month: string; key: string; events: CalendarEvent[] };

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

function nextMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function groupByMonth(events: CalendarEvent[]): CalendarEventGroup[] {
  const groups = new Map<string, CalendarEvent[]>();

  for (const event of events.toSorted((a, b) => a.timestamp - b.timestamp)) {
    const eventDate = new Date(event.timestamp);
    const key = monthKey(eventDate);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  return Array.from(groups, ([key, groupedEvents]) => ({
    month: MONTH_FORMAT.format(new Date(groupedEvents[0].timestamp)),
    key,
    events: groupedEvents,
  }));
}

function MonthGroup({ group }: { group: CalendarEventGroup }) {
  return (
    <section aria-labelledby={`events-${group.key}`}>
      <h2
        id={`events-${group.key}`}
        className="border-b border-neutral-200 pb-3 text-2xl font-semibold tracking-tight text-neutral-900"
      >
        {group.month}
      </h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {group.events.map((event) => (
          <EventCard key={event.key} event={event} />
        ))}
      </div>
    </section>
  );
}

function CalendarBlocks({ events }: { events: CalendarEvent[] }) {
  const groups = groupByMonth(events);
  const calendarNow = new Date(calendarToday());
  const visibleMonthKeys = new Set([
    monthKey(calendarNow),
    monthKey(nextMonth(calendarNow)),
  ]);
  const visibleGroups = groups.filter((group) => visibleMonthKeys.has(group.key));
  const displayedGroups = visibleGroups.length > 0 ? visibleGroups : groups.slice(0, 1);
  const displayedGroupKeys = new Set(displayedGroups.map((group) => group.key));
  const foldedGroups = groups.filter((group) => !displayedGroupKeys.has(group.key));

  if (groups.length === 0) {
    return (
      <p className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
        No events to show right now.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {displayedGroups.map((group) => (
        <MonthGroup key={group.key} group={group} />
      ))}
      {foldedGroups.length > 0 && (
        <details className="rounded-md border border-neutral-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider text-neutral-600">
            Future Events
          </summary>
          <div className="mt-6 space-y-10">
            {foldedGroups.map((group) => (
              <MonthGroup key={group.key} group={group} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function EventBlockGrid({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
        No events to show right now.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-5">
      {events.map((event) => (
        <EventCard key={event.key} event={event} />
      ))}
    </div>
  );
}

export async function EventsListPage() {
  await requireSiteFeature("events");
  const { upcoming, past } = splitCalendarEvents(await listPublicCalendarEvents());

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <header className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          What&apos;s coming up
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-6xl font-semibold tracking-tight text-neutral-900 sm:text-7xl">
          Events
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
          Browse TSA UIUC events by date, time, and location.
        </p>
        <p className="mx-auto mt-4 max-w-2xl rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          資訊以 Instagram 為主。
        </p>
      </header>

      <CalendarBlocks events={upcoming} />

      <section className="mt-20 border-t border-neutral-100 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Archive
        </p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          Past Events
        </h2>
        <div className="mt-8">
          <EventBlockGrid events={past} />
        </div>
      </section>
    </main>
  );
}
