import "server-only";
import { unstable_rethrow } from "next/navigation";
import { listUpcomingEvents } from "@/modules/events/server/queries";
import { getStaticUpcomingEvents } from "@/modules/events/data/upcoming";
import {
  deduplicateEvents,
  formatEventTime,
  normalizeCalendarEventTitle,
  timestampFromDate,
  type CalendarEvent,
} from "./calendar";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h12",
});

function timeRange(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt);
  if (!endsAt) return TIME_FORMAT.format(start);
  const end = new Date(endsAt);
  return `${TIME_FORMAT.format(start)} - ${TIME_FORMAT.format(end)}`;
}

export async function getUpcomingCalendarEvents(): Promise<CalendarEvent[]> {
  const databaseEvents = await listUpcomingEvents().catch((error) => {
    unstable_rethrow(error);
    console.warn("Unable to load upcoming events", error);
    return [];
  });
  const staticEvents = getStaticUpcomingEvents();
  const staticTitles = new Set(
    staticEvents.map((event) => normalizeCalendarEventTitle(event.title)),
  );
  const removedTitles = new Set(
    ["Hot Choco Sale", "Hot Cocoa Sale", "Taichella"].map(
      normalizeCalendarEventTitle,
    ),
  );

  const databaseCalendarEvents = databaseEvents
    .filter((event) => {
      const title = normalizeCalendarEventTitle(event.title);
      return !staticTitles.has(title) && !removedTitles.has(title);
    })
    .map((event) => {
      const start = new Date(event.starts_at);
      return {
        key: `db-${event.id}`,
        title: event.title,
        date: DATE_FORMAT.format(start),
        time: timeRange(event.starts_at, event.ends_at),
        location: event.location ?? "TBA",
        description: event.description ?? undefined,
        timestamp: start.getTime(),
      };
    });

  const staticCalendarEvents = staticEvents.map((event) => ({
    key: `static-${event.date}-${event.title}`,
    title: event.title,
    date: event.date,
    time: formatEventTime(event.time),
    location: event.location,
    description: event.description,
    timestamp: timestampFromDate(event.date),
    href: event.href,
    image: event.image,
    images: event.images,
  }));

  return deduplicateEvents([
    ...databaseCalendarEvents,
    ...staticCalendarEvents,
  ]).toSorted((a, b) => a.timestamp - b.timestamp);
}
