"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/core/supabase/server";
import { requireRole, getCurrentUser } from "@/core/rbac/server";
import { hasRole } from "@/core/rbac";
import { isSafeContentUrl, requireSiteFeature } from "@/modules/content";
import { eventLocalToIso, isEventTimeZone } from "../lib/timezone";
import type { RsvpStatus } from "../types";

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function readEvent(formData: FormData, path: string) {
  const fail = (message: string): never => redirect(`${path}?error=${encodeURIComponent(message)}`);
  const title = str(formData.get("title"));
  const time_zone = str(formData.get("time_zone"));
  if (!title || title.length > 200) fail("Title must be between 1 and 200 characters.");
  if (!isEventTimeZone(time_zone)) return fail("Choose an event timezone.");
  let starts_at: string, ends_at: string | null;
  try {
    starts_at = eventLocalToIso(str(formData.get("starts_at")), time_zone);
    const end = str(formData.get("ends_at"));
    ends_at = end ? eventLocalToIso(end, time_zone) : null;
  } catch (error) { return fail(error instanceof Error ? error.message : "Choose a valid date and time."); }
  if (ends_at && ends_at <= starts_at) fail("End time must be after the start time.");
  const capacityRaw = str(formData.get("capacity"));
  const capacity = capacityRaw ? Number(capacityRaw) : null;
  if (capacity !== null && (!Number.isSafeInteger(capacity) || capacity <= 0)) fail("Capacity must be a positive whole number.");
  const image_url = str(formData.get("image_url"));
  const link_url = str(formData.get("link_url"));
  if (!isSafeContentUrl(image_url, true) || !isSafeContentUrl(link_url)) fail("Use an http(s) URL or a local path for images and links.");
  return { title, description: str(formData.get("description")) || null, location: str(formData.get("location")) || null,
    starts_at, ends_at, capacity, image_url, link_url, time_zone,
    time_tba: formData.get("time_tba") === "on", time_note: str(formData.get("time_note")),
    is_published: formData.get("is_published") === "on" };
}

export async function createEventAction(formData: FormData) {
  const user = await requireRole("admin");
  const fields = readEvent(formData, "/admin/events/new");
  const supabase = await createClient();
  const { error } = await supabase.from("events_event").insert({ ...fields, created_by: user.id });
  if (error) redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/events?created=ok");
}

export async function updateEventAction(formData: FormData) {
  await requireRole("admin");
  const id = str(formData.get("id"));
  if (!id) throw new Error("Event id is required.");
  const path = `/admin/events/${encodeURIComponent(id)}/edit`;
  const fields = readEvent(formData, path);
  const supabase = await createClient();
  const { data, error } = await supabase.from("events_event").update(fields).eq("id", id).select("id").maybeSingle();
  if (error || !data) redirect(`${path}?error=${encodeURIComponent(error?.message ?? "This event no longer exists.")}`);
  revalidatePath("/", "layout");
  redirect(`/admin/events?updated=${encodeURIComponent(id)}`);
}

export async function deleteEventAction(formData: FormData) {
  await requireRole("admin");
  const id = str(formData.get("id"));
  if (!id) throw new Error("Event id is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("events_event").delete().eq("id", id);
  if (error) redirect(`/admin/events/${encodeURIComponent(id)}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/events?deleted=ok");
}

export async function rsvpAction(formData: FormData) {
  await requireSiteFeature("events");
  const user = await getCurrentUser();
  if (!user) redirect("/?error=not_signed_in");
  if (!hasRole(user.role, "member")) {
    redirect(`/?error=forbidden_member`);
  }

  const eventId = str(formData.get("event_id"));
  const status = str(formData.get("status")) as RsvpStatus;
  if (!eventId) throw new Error("event_id required");
  if (status !== "going" && status !== "maybe") {
    throw new Error(`Invalid status: ${status}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events_rsvp")
    .upsert(
      { event_id: eventId, user_id: user.id, status },
      { onConflict: "event_id,user_id" },
    );

  if (error) {
    redirect(`/events/${eventId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/events/${eventId}`);
  redirect(`/events/${eventId}?rsvp=ok`);
}

export async function removeRsvpAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/?error=not_signed_in");

  const eventId = str(formData.get("event_id"));
  if (!eventId) throw new Error("event_id required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("events_rsvp")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/events/${eventId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/events/${eventId}`);
  redirect(`/events/${eventId}?rsvp=removed`);
}
