import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import defaultEvents from "../data/default-events.json";
import { toCalendarEvent } from "../lib/calendar";
import { createClient } from "@/core/supabase/server";
import { requireAuth, requireRole } from "@/core/rbac/server";
import type {
  EventRecord,
  RsvpRecord,
  RsvpStatus,
  RsvpWithEvent,
} from "@/modules/events/types";

export async function listUpcomingEvents(): Promise<EventRecord[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events_event")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function listPastEvents(): Promise<EventRecord[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events_event")
    .select("*")
    .eq("is_published", true)
    .lt("starts_at", nowIso)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function listAllEvents(): Promise<EventRecord[]> {
  await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_event")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_event")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as EventRecord | null) ?? null;
}

export async function getMyRsvp(eventId: string): Promise<RsvpRecord | null> {
  const user = await requireAuth();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_rsvp")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return (data as RsvpRecord | null) ?? null;
}

export async function listMyRsvpsForEvents(
  eventIds: string[],
): Promise<RsvpRecord[]> {
  if (eventIds.length === 0) return [];
  const user = await requireAuth();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_rsvp")
    .select("*")
    .in("event_id", eventIds)
    .eq("user_id", user.id);
  if (error) throw error;
  return (data ?? []) as RsvpRecord[];
}

type MyRsvpRow = {
  status: RsvpStatus;
  events_event: EventRecord;
};

export async function listMyUpcomingRsvps(): Promise<RsvpWithEvent[]> {
  const user = await requireAuth();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events_rsvp")
    .select("status, events_event!inner(*)")
    .eq("user_id", user.id)
    .eq("events_event.is_published", true)
    .gte("events_event.starts_at", nowIso)
    .order("starts_at", { referencedTable: "events_event", ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as MyRsvpRow[]).map((row) => ({
    status: row.status,
    event: row.events_event,
  }));
}

// Database records replace the public snapshot completely after setup. An empty
// published calendar stays empty; deleted or draft events never reappear.
export const listPublicCalendarEvents = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events_event")
      .select("*, image_gallery, show_in_archive")
      .eq("is_published", true).order("starts_at", { ascending: true });
    if (error) throw error;
    return (data as EventRecord[] ?? []).map(toCalendarEvent);
  } catch (error) {
    unstable_rethrow(error);
    console.warn("Event updates unavailable; displaying the existing public schedule", error);
    return defaultEvents.map((event) => toCalendarEvent({
      ...event, id: `static-${event.source_key}`, time_zone: event.time_zone as EventRecord["time_zone"],
      capacity: null, created_by: null, is_published: true, created_at: "", updated_at: "",
    }));
  }
});
