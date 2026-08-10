"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/rbac/server";
import { createClient } from "@/core/supabase/server";
import { parseMoneyAmount } from "@/modules/listings/lib/money";
import type { SubleasePostType } from "@/modules/listings/types";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function loginRedirect(next: string): never {
  redirect(`/login?next=${encodeURIComponent(next)}`);
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function requireMoney(
  raw: string,
  path: string,
  label: string,
  { required }: { required: boolean },
): string {
  if (!raw) {
    if (required) fail(path, `${label} is required.`);
    return "";
  }
  const amount = parseMoneyAmount(raw);
  if (!amount) {
    fail(path, `${label} must be a number (for example 50 or 50.99).`);
  }
  return amount;
}

export async function createMarketplaceListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/marketplace";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const title = str(formData.get("title"));
  const price = requireMoney(str(formData.get("price")), path, "Price", {
    required: true,
  });
  const contact = str(formData.get("seller"));
  const tag = str(formData.get("tag")) || "General";
  const description = str(formData.get("description"));

  if (!title || !contact) {
    fail(path, "Item, price, and contact are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("listings_marketplace").insert({
    user_id: user.id,
    title,
    price,
    contact,
    tag,
    description,
  });

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?posted=ok`);
}

export async function deleteMarketplaceListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/marketplace";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const id = str(formData.get("id"));
  if (!id) fail(path, "Missing listing id.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings_marketplace")
    .delete()
    .eq("id", id);

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?deleted=ok`);
}

export async function createSubleaseListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/sublease";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const rawType = str(formData.get("type")).toLowerCase();
  const post_type: SubleasePostType =
    rawType === "request" ? "request" : "offer";
  const title = str(formData.get("title"));
  const startDate = str(formData.get("start_date"));
  const endDate = str(formData.get("end_date"));
  const budget = requireMoney(str(formData.get("budget")), path, "Budget", {
    required: false,
  });
  const contact = str(formData.get("contact"));
  const details = str(formData.get("details"));

  if (!title || !startDate || !endDate || !contact) {
    fail(path, "Title, start date, end date, and contact are required.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    fail(path, "Choose valid start and end dates.");
  }

  if (endDate < startDate) {
    fail(path, "End date must be on or after the start date.");
  }

  const date_range = `${startDate} – ${endDate}`;

  const supabase = await createClient();
  const { error } = await supabase.from("listings_sublease").insert({
    user_id: user.id,
    post_type,
    title,
    date_range,
    budget,
    contact,
    details,
  });

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?posted=ok`);
}

export async function deleteSubleaseListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/sublease";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const id = str(formData.get("id"));
  if (!id) fail(path, "Missing listing id.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings_sublease")
    .delete()
    .eq("id", id);

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?deleted=ok`);
}

export async function createCarpoolListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/carpool";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const trip_date = str(formData.get("date"));
  const route = str(formData.get("route"));
  const seats = str(formData.get("seats"));
  const contact = str(formData.get("contact"));
  const note = str(formData.get("note"));

  if (!trip_date || !route || !contact) {
    fail(path, "Date, route, and contact are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("listings_carpool").insert({
    user_id: user.id,
    trip_date,
    route,
    seats,
    contact,
    note,
  });

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?posted=ok`);
}

export async function deleteCarpoolListingAction(
  formData: FormData,
): Promise<void> {
  const path = "/current-students/carpool";
  const user = await getCurrentUser();
  if (!user) loginRedirect(path);

  const id = str(formData.get("id"));
  if (!id) fail(path, "Missing listing id.");

  const supabase = await createClient();
  const { error } = await supabase.from("listings_carpool").delete().eq("id", id);

  if (error) fail(path, error.message);

  revalidatePath(path);
  redirect(`${path}?deleted=ok`);
}
