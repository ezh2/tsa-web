import type { StaticImageData } from "next/image";
import type { EventRecord } from "../types";

export type CalendarEvent = {
  key: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  timestamp: number;
  href?: string;
  detailsHref?: string;
  showInArchive?: boolean;
  image?: { src: StaticImageData | string; alt: string };
  images?: { src: StaticImageData | string; alt: string }[];
};

export function toCalendarEvent(event: EventRecord): CalendarEvent {
  const timeZone = event.time_zone || "America/Chicago";
  const start = new Date(event.starts_at);
  const date = start.toLocaleDateString("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  });
  const time = event.time_tba
    ? event.time_note || "Time to be announced"
    : timeFormat.format(start) +
      (event.ends_at ? ` - ${timeFormat.format(new Date(event.ends_at))}` : "");

  return {
    key: event.id,
    title: event.title,
    date,
    time,
    location: event.location ?? "TBA",
    description: event.description ?? undefined,
    timestamp: Date.parse(date + " UTC"),
    href: event.link_url || undefined,
    detailsHref: event.id.startsWith("static-") ? undefined : `/events/${event.id}`,
    showInArchive: event.show_in_archive ?? true,
    image: event.image_url ? { src: event.image_url, alt: event.title } : undefined,
    images: event.image_gallery?.length ? event.image_gallery : undefined,
  };
}

function normalizeTitle(title: string): string {
  return title
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/^tsa\s*/u, "")
    .replace(/[\p{P}\p{S}\s]+/gu, "");
}

function eventIdentity(event: CalendarEvent): string {
  return `${normalizeTitle(event.title)}-${normalizeTitle(event.date)}`;
}

function hasEventImage(event: CalendarEvent): boolean {
  return Boolean(event.image || event.images?.length);
}

export function deduplicateEvents(events: CalendarEvent[]): CalendarEvent[] {
  const uniqueEvents = new Map<string, CalendarEvent>();

  for (const event of events) {
    const identity = eventIdentity(event);
    const existing = uniqueEvents.get(identity);
    if (!existing || (!hasEventImage(existing) && hasEventImage(event))) {
      uniqueEvents.set(identity, event);
    }
  }

  return [...uniqueEvents.values()];
}

export function calendarToday(now = new Date()): number {
  const chicagoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return Date.parse(chicagoDate + "T00:00:00Z");
}

export function splitCalendarEvents(events: CalendarEvent[], now = new Date()) {
  const today = calendarToday(now);
  const uniqueEvents = deduplicateEvents(events);
  return {
    upcoming: uniqueEvents
      .filter((event) => event.timestamp >= today)
      .toSorted((a, b) => a.timestamp - b.timestamp),
    past: uniqueEvents
      .filter((event) => event.showInArchive !== false && event.timestamp < today)
      .toSorted((a, b) => b.timestamp - a.timestamp),
  };
}
