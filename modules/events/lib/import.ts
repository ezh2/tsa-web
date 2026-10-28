import { isSafeContentUrl } from "@/modules/content/lib/schema";
import { eventLocalToIso, isEventTimeZone, type EventTimeZone } from "./timezone";

export interface EventImportRecord {
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number | null;
  image_url: string;
  image_gallery: { src: string; alt: string }[];
  link_url: string;
  time_zone: EventTimeZone;
  time_tba: boolean;
  time_note: string;
  show_in_archive: boolean;
  is_published: boolean;
}

export interface EventImportIssue {
  row: number | null;
  message: string;
}

export interface EventImportDuplicate {
  row: number;
  matchedRow: number | null;
  title: string;
  starts_at: string;
  time_zone: EventTimeZone;
}

const allowedFields = new Set([
  "title", "description", "location", "starts_at", "ends_at", "capacity",
  "image_url", "image_gallery", "link_url", "time_zone", "time_tba",
  "time_note", "show_in_archive", "is_published",
]);

function optionalString(value: unknown, field: string, limit: number): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > limit) {
    throw new Error(`${field} must be text under ${limit} characters.`);
  }
  return value.trim() || null;
}

function optionalBoolean(value: unknown, fallback: boolean, field: string): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new Error(`${field} must be true or false.`);
  return value;
}

function normalizeEvent(value: unknown): EventImportRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Each event must be an object.");
  }
  const input = value as Record<string, unknown>;
  const unknownField = Object.keys(input).find((field) => !allowedFields.has(field));
  if (unknownField) throw new Error(`Unknown field: ${unknownField}.`);

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title || title.length > 200) throw new Error("Title is required and must be 200 characters or fewer.");

  const zone = input.time_zone ?? "America/Chicago";
  if (typeof zone !== "string" || !isEventTimeZone(zone)) {
    throw new Error("time_zone must be America/Chicago, Asia/Taipei, or UTC.");
  }

  if (typeof input.starts_at !== "string") throw new Error("starts_at is required in YYYY-MM-DDTHH:mm local time.");
  let starts_at: string;
  try {
    starts_at = eventLocalToIso(input.starts_at, zone);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "starts_at is invalid.");
  }

  let ends_at: string | null = null;
  if (input.ends_at !== undefined && input.ends_at !== null && input.ends_at !== "") {
    if (typeof input.ends_at !== "string") throw new Error("ends_at must be a local date/time or null.");
    try {
      ends_at = eventLocalToIso(input.ends_at, zone);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "ends_at is invalid.");
    }
    if (ends_at <= starts_at) throw new Error("ends_at must be after starts_at.");
  }

  const description = optionalString(input.description, "description", 20000);
  const location = optionalString(input.location, "location", 500);
  const time_note = optionalString(input.time_note, "time_note", 500) ?? "";
  const image_url = optionalString(input.image_url, "image_url", 20000) ?? "";
  const link_url = optionalString(input.link_url, "link_url", 20000) ?? "";
  if (!isSafeContentUrl(image_url, true)) throw new Error("image_url must be an http(s) URL or a local path.");
  if (!isSafeContentUrl(link_url)) throw new Error("link_url must be a safe http(s), mailto, or local link.");

  const capacity = input.capacity === undefined || input.capacity === null || input.capacity === ""
    ? null
    : input.capacity;
  if (capacity !== null && (!Number.isSafeInteger(capacity) || Number(capacity) <= 0)) {
    throw new Error("capacity must be a positive whole number or null.");
  }

  const gallery = input.image_gallery ?? [];
  if (!Array.isArray(gallery) || gallery.length > 20) throw new Error("image_gallery must contain no more than 20 images.");
  const image_gallery = gallery.map((image, index) => {
    if (!image || typeof image !== "object" || Array.isArray(image)) {
      throw new Error(`image_gallery item ${index + 1} must contain src and alt text.`);
    }
    const item = image as Record<string, unknown>;
    if (typeof item.src !== "string" || !item.src.trim() || item.src.length > 20000 || !isSafeContentUrl(item.src, true)) {
      throw new Error(`image_gallery item ${index + 1} has an invalid src.`);
    }
    if (typeof item.alt !== "string" || item.alt.length > 500) {
      throw new Error(`image_gallery item ${index + 1} alt must be text under 500 characters.`);
    }
    return { src: item.src.trim(), alt: item.alt.trim() };
  });

  return {
    title, description, location, starts_at, ends_at,
    capacity: capacity === null ? null : Number(capacity),
    image_url, image_gallery, link_url, time_zone: zone,
    time_tba: optionalBoolean(input.time_tba, false, "time_tba"),
    time_note,
    show_in_archive: optionalBoolean(input.show_in_archive, true, "show_in_archive"),
    is_published: optionalBoolean(input.is_published, true, "is_published"),
  };
}

export function parseEventImportJson(raw: string): { events: EventImportRecord[]; issues: EventImportIssue[] } {
  if (!raw.trim()) return { events: [], issues: [{ row: null, message: "Paste a JSON array of events." }] };
  if (raw.length > 1_000_000) return { events: [], issues: [{ row: null, message: "JSON file must be 1 MB or smaller." }] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { events: [], issues: [{ row: null, message: "Invalid JSON. Check commas, quotes, and brackets." }] };
  }
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    parsed = (parsed as Record<string, unknown>).events;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 100) {
    return { events: [], issues: [{ row: null, message: "Provide an array with 1 to 100 events." }] };
  }

  const events: EventImportRecord[] = [];
  const issues: EventImportIssue[] = [];
  parsed.forEach((item, index) => {
    try {
      events.push(normalizeEvent(item));
    } catch (error) {
      issues.push({ row: index + 1, message: error instanceof Error ? error.message : "Invalid event." });
    }
  });
  return { events, issues };
}

function duplicateKey(title: string, startsAt: string): string {
  return `${title.trim().toLowerCase()}\u0000${new Date(startsAt).toISOString()}`;
}

export function findEventImportDuplicates(
  events: EventImportRecord[],
  existing: { title: string; starts_at: string }[],
): EventImportDuplicate[] {
  const seen = new Map<string, number | null>();
  for (const event of existing) seen.set(duplicateKey(event.title, event.starts_at), null);

  const duplicates: EventImportDuplicate[] = [];
  events.forEach((event, index) => {
    const key = duplicateKey(event.title, event.starts_at);
    if (seen.has(key)) {
      duplicates.push({ row: index + 1, matchedRow: seen.get(key) ?? null, title: event.title, starts_at: event.starts_at, time_zone: event.time_zone });
    } else {
      seen.set(key, index + 1);
    }
  });
  return duplicates;
}
