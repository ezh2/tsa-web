import "server-only";
import { createClient } from "@/core/supabase/server";
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
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function listAllEvents(): Promise<EventRecord[]> {
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_rsvp")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();
  if (error) throw error;
  return (data as RsvpRecord | null) ?? null;
}

type MyRsvpRow = {
  status: RsvpStatus;
  events_event: EventRecord;
};

export async function listMyUpcomingRsvps(): Promise<RsvpWithEvent[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events_rsvp")
    .select("status, events_event!inner(*)")
    .gte("events_event.starts_at", nowIso)
    .order("starts_at", { referencedTable: "events_event", ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as MyRsvpRow[]).map((row) => ({
    status: row.status,
    event: row.events_event,
  }));
}
