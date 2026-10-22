import type { StaticImageData } from "next/image";

export type CalendarEvent = {
  key: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  timestamp: number;
  href?: string;
  image?: {
    src: StaticImageData;
    alt: string;
  };
  images?: {
    src: StaticImageData;
    alt: string;
  }[];
};

function normalizeEventTitle(title: string): string {
  return title
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/^tsa\s*/u, "")
    .replace(/[\p{P}\p{S}\s]+/gu, "");
}

function eventIdentity(event: CalendarEvent): string {
  const normalize = (value: string) =>
    value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[\p{P}\p{S}\s]+/gu, "");

  return `${normalizeEventTitle(event.title)}-${normalize(event.date)}`;
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

export function normalizeCalendarEventTitle(title: string): string {
  return normalizeEventTitle(title);
}

export function timestampFromDate(date: string): number {
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function formatEventTime(time: string): string {
  const match = time.match(
    /^\s*(\d{1,2}):(\d{2})(?:\s*-\s*(\d{1,2}):(\d{2}))?\s*$/,
  );
  if (!match) return time;

  const formatClock = (hourText: string, minute: string) => {
    const hour = Number(hourText);
    const period = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${minute} ${period}`;
  };

  const start = formatClock(match[1], match[2]);
  return match[3] ? `${start} - ${formatClock(match[3], match[4])}` : start;
}
