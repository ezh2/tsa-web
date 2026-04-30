"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/core/supabase/server";
import { requireRole, getCurrentUser } from "@/core/rbac/server";
import { hasRole } from "@/core/rbac";
import type { RsvpStatus } from "@/modules/events/types";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function nullable(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s === "" ? null : s;
}

function toIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid datetime: ${value}`);
  }
  return d.toISOString();
}

export async function createEventAction(formData: FormData) {
  const user = await requireRole("director");

  const title = str(formData.get("title"));
  const description = nullable(formData.get("description"));
  const location = nullable(formData.get("location"));
  const startsAtRaw = str(formData.get("starts_at"));
  const endsAtRaw = str(formData.get("ends_at"));
  const capacityRaw = str(formData.get("capacity"));

  if (!title) {
    redirect("/admin/events/new?error=title_required");
  }
  if (!startsAtRaw) {
    redirect("/admin/events/new?error=starts_at_required");
  }

  const starts_at = toIso(startsAtRaw);
  const ends_at = endsAtRaw ? toIso(endsAtRaw) : null;
  const capacity = capacityRaw ? Number.parseInt(capacityRaw, 10) : null;

  if (capacity !== null && (!Number.isFinite(capacity) || capacity <= 0)) {
    redirect("/admin/events/new?error=invalid_capacity");
  }
  if (ends_at && new Date(ends_at) <= new Date(starts_at)) {
    redirect("/admin/events/new?error=ends_before_starts");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_event")
    .insert({
      title,
      description,
      location,
      starts_at,
      ends_at,
      capacity,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect(`/events/${data.id}`);
}

export async function updateEventAction(formData: FormData) {
  await requireRole("director");

  const id = str(formData.get("id"));
  if (!id) throw new Error("id required");

  const editPath = `/admin/events/${id}/edit`;

  const title = str(formData.get("title"));
  const description = nullable(formData.get("description"));
  const location = nullable(formData.get("location"));
  const startsAtRaw = str(formData.get("starts_at"));
  const endsAtRaw = str(formData.get("ends_at"));
  const capacityRaw = str(formData.get("capacity"));

  if (!title) redirect(`${editPath}?error=title_required`);
  if (!startsAtRaw) redirect(`${editPath}?error=starts_at_required`);

  const starts_at = toIso(startsAtRaw);
  const ends_at = endsAtRaw ? toIso(endsAtRaw) : null;
  const capacity = capacityRaw ? Number.parseInt(capacityRaw, 10) : null;

  if (capacity !== null && (!Number.isFinite(capacity) || capacity <= 0)) {
    redirect(`${editPath}?error=invalid_capacity`);
  }
  if (ends_at && new Date(ends_at) <= new Date(starts_at)) {
    redirect(`${editPath}?error=ends_before_starts`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("events_event")
    .update({ title, description, location, starts_at, ends_at, capacity })
    .eq("id", id);

  if (error) {
    redirect(`${editPath}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events?updated=${id}`);
}

export async function deleteEventAction(formData: FormData) {
  await requireRole("director");

  const id = str(formData.get("id"));
  if (!id) throw new Error("id required");

  const supabase = await createClient();
  const { error } = await supabase.from("events_event").delete().eq("id", id);

  if (error) {
    redirect(
      `/admin/events/${id}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events?deleted=ok");
}

export async function rsvpAction(formData: FormData) {
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
