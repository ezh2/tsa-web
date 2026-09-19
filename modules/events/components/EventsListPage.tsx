import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import {
  listPastEvents,
  listUpcomingEvents,
} from "@/modules/events/server/queries";
import {
  getStaticPastEvents,
  getStaticUpcomingEvents,
  type StaticUpcomingEvent,
} from "@/modules/events/data/upcoming";

type CalendarEvent = {
  key: string;
  title: string;
  date: string;
  time: string;
  location: string;
  timestamp: number;
  href?: string;
};

type CalendarEventGroup = {
  month: string;
  key: string;
  events: CalendarEvent[];
};

type PastEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
};

const PAST_EVENTS: PastEvent[] = [
  {
    title: "Homecoming @RUFF",
    date: "June 29, 2026",
    time: "Time announced by WWTSA",
    location: "Partner event with WWTSA",
  },
  {
    title: "Taiwanese Bento",
    date: "April 18, 2026",
    time: "13:30 - 16:00",
    location: "Anniversary Plaza",
  },
  {
    title: "Lunar New Year Banquet",
    date: "February 14, 2026",
    time: "Time announced through TSA Linktree",
    location: "Golden Harbor / 漁滿樓",
  },
  {
    title: "TSA Singing Contest",
    date: "November 15, 2025",
    time: "20:30",
    location: "Illini Room A",
  },
];

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const MONTH_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

function timestampFromDate(date: string): number {
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function nextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function timeRange(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt);
  if (!endsAt) return TIME_FORMAT.format(start);
  const end = new Date(endsAt);
  return `${TIME_FORMAT.format(start)} - ${TIME_FORMAT.format(end)}`;
}

function fromStaticEvent(event: StaticUpcomingEvent): CalendarEvent {
  return {
    key: `static-${event.date}-${event.title}`,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    timestamp: timestampFromDate(event.date),
    href: event.href,
  };
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
          <EventBlock key={event.key} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventBlock({ event }: { event: CalendarEvent }) {
  const content = (
    <article className="flex min-h-32 flex-col justify-between rounded-md border border-black/10 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase leading-tight tracking-wider text-neutral-500">
          {event.date}
        </p>
        <h3 className="mt-1.5 text-sm font-semibold leading-tight text-neutral-950">
          {event.title}
        </h3>
      </div>
      <dl className="mt-3 grid gap-2 text-[0.7rem] leading-tight text-neutral-700">
        <div className="min-w-0">
          <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-neutral-400">
            Time
          </dt>
          <dd className="mt-0.5 font-medium">{event.time}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-neutral-400">
            Location
          </dt>
          <dd className="mt-0.5 line-clamp-2 font-medium">
            {event.location}
          </dd>
        </div>
      </dl>
    </article>
  );

  if (!event.href) return content;

  return (
    <Link
      href={event.href}
      rel="noopener noreferrer"
      target="_blank"
      className="block"
    >
      {content}
    </Link>
  );
}

function CalendarBlocks({
  events,
  now = new Date(),
}: {
  events: CalendarEvent[];
  now?: Date;
}) {
  const groups = groupByMonth(events);
  const visibleMonthKeys = new Set([monthKey(now), monthKey(nextMonth(now))]);
  const visibleGroups = groups.filter((group) =>
    visibleMonthKeys.has(group.key),
  );
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
        <EventBlock key={event.key} event={event} />
      ))}
    </div>
  );
}

export async function EventsListPage() {
  const events = await listUpcomingEvents().catch((error) => {
    unstable_rethrow(error);
    console.warn("Unable to load upcoming events", error);
    return [];
  });
  const pastEvents = await listPastEvents().catch((error) => {
    unstable_rethrow(error);
    console.warn("Unable to load past events", error);
    return [];
  });

  const upcomingCalendarEvents: CalendarEvent[] = [
    ...events.map((event) => {
      const start = new Date(event.starts_at);
      return {
        key: `db-${event.id}`,
        title: event.title,
        date: DATE_FORMAT.format(start),
        time: timeRange(event.starts_at, event.ends_at),
        location: event.location ?? "TBA",
        timestamp: start.getTime(),
      };
    }),
    ...getStaticUpcomingEvents().map(fromStaticEvent),
  ];

  const pastCalendarEvents: CalendarEvent[] = [
    ...pastEvents.map((event) => {
      const start = new Date(event.starts_at);
      return {
        key: `db-past-${event.id}`,
        title: event.title,
        date: DATE_FORMAT.format(start),
        time: timeRange(event.starts_at, event.ends_at),
        location: event.location ?? "TBA",
        timestamp: start.getTime(),
      };
    }),
    ...getStaticPastEvents().map(fromStaticEvent),
    ...PAST_EVENTS.map((event) => ({
      key: `manual-past-${event.date}-${event.title}`,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      timestamp: timestampFromDate(event.date),
    })),
  ].toSorted((a, b) => b.timestamp - a.timestamp);

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

      <CalendarBlocks events={upcomingCalendarEvents} />

      <section className="mt-20 border-t border-neutral-100 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Archive
        </p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          Past Events
        </h2>
        <div className="mt-8">
          <EventBlockGrid events={pastCalendarEvents} />
        </div>
      </section>
    </main>
  );
}
